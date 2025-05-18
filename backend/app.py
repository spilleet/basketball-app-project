from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os
import datetime
from sqlalchemy.orm import validates

app = Flask(__name__)

# 데이터베이스 설정
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'site.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False # True로 설정하면 SQL 쿼리 로그 확인 가능
db = SQLAlchemy(app)

# 연관 테이블: User와 Team의 다대다 관계
team_members = db.Table('team_members',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('team_id', db.Integer, db.ForeignKey('team.id'), primary_key=True)
)

# 사용자 모델 정의
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256))
    name = db.Column(db.String(80), nullable=False)
    
    games_hosted = db.relationship('Game', backref='host', lazy=True, foreign_keys='Game.host_id')
    teams = db.relationship('Team', secondary=team_members, backref=db.backref('members', lazy='dynamic'), lazy='dynamic') # User가 속한 Team들

    def __repr__(self):
        return f'<User {self.email}>'

    def to_dict(self, include_games_hosted=False, include_teams=False):
        data = {
            "id": self.id,
            "email": self.email,
            "name": self.name
        }
        if include_games_hosted:
            # 순환 참조 방지를 위해 game.to_dict에서 host 정보는 빼고 직렬화
            data['games_hosted'] = [game.to_dict(include_host=False) for game in self.games_hosted]
        if include_teams:
            # 순환 참조 방지를 위해 team.to_dict에서 members 정보는 빼고 직렬화
            data['teams'] = [team.to_dict(include_members=False) for team in self.teams]
        return data

# 팀 모델 정의
class Team(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Game과의 관계는 Game 모델에서 backref로 설정됨 (home_games, away_games)
    # User와의 관계는 User 모델에서 secondary로 설정됨 (members)

    def __repr__(self):
        return f'<Team {self.name}>'

    def to_dict(self, include_members=False, include_games=False):
        data = {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
        if include_members:
             # 순환 참조 방지를 위해 user.to_dict에서 teams 정보는 빼고 직렬화
            data['members'] = [user.to_dict(include_teams=False) for user in self.members]
        if include_games:
            home_games = Game.query.filter_by(home_team_id=self.id).all()
            away_games = Game.query.filter_by(away_team_id=self.id).all()
            # 순환 참조 방지: game.to_dict에서 home_team/away_team 상세 정보는 빼고 id만 포함하거나 간략화
            data['home_games'] = [game.to_dict(include_teams_as_ids=True) for game in home_games]
            data['away_games'] = [game.to_dict(include_teams_as_ids=True) for game in away_games]
        return data

# 코트 모델 정의
class Court(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    description = db.Column(db.String(500), nullable=True)
    imageUrl = db.Column(db.String(200), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    games = db.relationship('Game', backref='court', lazy=True)

    def __repr__(self):
        return f'<Court {self.name}>'

    def to_dict(self, include_games=False):
        data = {
            "id": self.id,
            "name": self.name,
            "address": self.address,
            "description": self.description,
            "imageUrl": self.imageUrl,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
        if include_games:
            # 순환 참조 방지: game.to_dict에서 court 정보는 빼고 직렬화
            data['games'] = [game.to_dict(include_court=False) for game in self.games]
        return data

# 게임 상태 문자열 상수 (Enum 대신 사용)
class GameStatus:
    SCHEDULED = "SCHEDULED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

# 게임 모델 정의
class Game(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date_time = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(50), default=GameStatus.SCHEDULED, nullable=False)
    
    court_id = db.Column(db.Integer, db.ForeignKey('court.id'), nullable=False)
    host_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    home_team_id = db.Column(db.Integer, db.ForeignKey('team.id'), nullable=True) # Team 모델의 PK 참조
    away_team_id = db.Column(db.Integer, db.ForeignKey('team.id'), nullable=True) # Team 모델의 PK 참조

    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    home_team = db.relationship('Team', foreign_keys=[home_team_id], backref=db.backref('home_games', lazy='dynamic'))
    away_team = db.relationship('Team', foreign_keys=[away_team_id], backref=db.backref('away_games', lazy='dynamic'))
    # court, host 관계는 각 모델에서 backref로 정의됨

    def __repr__(self):
        return f'<Game {self.id} at {self.court.name if self.court else self.court_id}>'

    def to_dict(self, include_court=True, include_host=True, include_teams_as_ids=False, include_full_teams=False):
        data = {
            "id": self.id,
            "date_time": self.date_time.isoformat() if self.date_time else None,
            "status": self.status,
            "court_id": self.court_id,
            "host_id": self.host_id,
            "home_team_id": self.home_team_id,
            "away_team_id": self.away_team_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
        if include_court and self.court:
            data['court'] = self.court.to_dict(include_games=False) # 순환 방지
        if include_host and self.host:
            data['host'] = self.host.to_dict(include_games_hosted=False) # 순환 방지
        
        if include_full_teams: # 전체 팀 정보 포함 (순환 주의)
            if self.home_team:
                data['home_team'] = self.home_team.to_dict(include_games=False, include_members=False) # 순환 방지
            if self.away_team:
                data['away_team'] = self.away_team.to_dict(include_games=False, include_members=False) # 순환 방지
        elif include_teams_as_ids: # ID만 포함 (Team.to_dict에서 사용)
             data['home_team_name'] = self.home_team.name if self.home_team else None
             data['away_team_name'] = self.away_team.name if self.away_team else None

        return data

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')

    if not email or not password or not name:
        return jsonify({"error": "이메일, 비밀번호, 이름을 모두 입력해주세요."}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "이미 사용 중인 이메일입니다."}), 400

    hashed_password = generate_password_hash(password)
    new_user = User(email=email, password_hash=hashed_password, name=name)
    
    try:
        db.session.add(new_user)
        db.session.commit()
        user_info = {
            "id": new_user.id,
            "email": new_user.email,
            "name": new_user.name
        }
        return jsonify(user_info), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "회원가입 중 오류가 발생했습니다."}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "이메일과 비밀번호를 모두 입력해주세요."}), 400

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password_hash, password):
        user_info = {
            "id": user.id,
            "email": user.email,
            "name": user.name
        }
        return jsonify(user_info), 200
    else:
        return jsonify({"error": "이메일 또는 비밀번호가 일치하지 않습니다."}), 401

# 모든 코트 정보 가져오기
@app.route('/api/courts', methods=['GET'])
def get_courts():
    try:
        courts = Court.query.all()
        return jsonify([court.to_dict() for court in courts]), 200
    except Exception as e:
        return jsonify({"error": "경기장 목록을 불러오는데 실패했습니다."}), 500

# 새 코트 생성
@app.route('/api/courts', methods=['POST'])
def create_court():
    data = request.get_json()
    name = data.get('name')
    address = data.get('address')
    description = data.get('description')
    imageUrl = data.get('imageUrl')

    if not name or not address:
        return jsonify({"error": "이름과 주소는 필수 항목입니다."}), 400

    new_court = Court(name=name, address=address, description=description, imageUrl=imageUrl)
    try:
        db.session.add(new_court)
        db.session.commit()
        return jsonify(new_court.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        # print(f"Error creating court: {e}") # 디버깅용
        return jsonify({"error": "코트 생성 중 오류가 발생했습니다."}), 500

# 특정 코트 정보 가져오기
@app.route('/api/courts/<int:court_id>', methods=['GET'])
def get_court(court_id):
    court = Court.query.get_or_404(court_id)
    return jsonify(court.to_dict()), 200

# 특정 코트 정보 수정
@app.route('/api/courts/<int:court_id>', methods=['PUT'])
def update_court(court_id):
    court = Court.query.get_or_404(court_id)
    data = request.get_json()

    court.name = data.get('name', court.name)
    court.address = data.get('address', court.address)
    court.description = data.get('description', court.description)
    court.imageUrl = data.get('imageUrl', court.imageUrl)
    
    # 필수 항목이 비어있는지 확인 (업데이트 시에도)
    if not court.name or not court.address:
        return jsonify({"error": "이름과 주소는 필수 항목입니다."}), 400

    try:
        db.session.commit()
        return jsonify(court.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        # print(f"Error updating court: {e}") # 디버깅용
        return jsonify({"error": "코트 정보 수정 중 오류가 발생했습니다."}), 500

# 특정 코트 삭제
@app.route('/api/courts/<int:court_id>', methods=['DELETE'])
def delete_court(court_id):
    court = Court.query.get_or_404(court_id)
    try:
        db.session.delete(court)
        db.session.commit()
        return jsonify({"message": "코트가 성공적으로 삭제되었습니다."}), 200
    except Exception as e:
        db.session.rollback()
        # print(f"Error deleting court: {e}") # 디버깅용
        return jsonify({"error": "코트 삭제 중 오류가 발생했습니다."}), 500

# --- 팀 API ---
@app.route('/api/teams', methods=['POST'])
def create_team():
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')
    member_ids = data.get('member_ids', []) # 초기 멤버 ID 리스트 (선택)

    if not name:
        return jsonify({"error": "팀 이름은 필수 항목입니다."}), 400
    
    if Team.query.filter_by(name=name).first():
        return jsonify({"error": "이미 사용 중인 팀 이름입니다."}), 400

    new_team = Team(name=name, description=description)
    
    if member_ids:
        for user_id in member_ids:
            user = User.query.get(user_id)
            if user:
                new_team.members.append(user)
            else:
                # 존재하지 않는 사용자 ID는 경고 또는 오류 처리 (여기서는 무시)
                app.logger.warning(f"User ID {user_id} not found when creating team {name}")


    try:
        db.session.add(new_team)
        db.session.commit()
        return jsonify(new_team.to_dict(include_members=True)), 201
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error creating team: {e}")
        return jsonify({"error": "팀 생성 중 오류 발생"}), 500

@app.route('/api/teams', methods=['GET'])
def get_teams():
    try:
        teams = Team.query.all()
        # 멤버 정보를 포함하여 반환할지 여부 결정 (여기서는 포함)
        return jsonify([team.to_dict(include_members=True) for team in teams]), 200
    except Exception as e:
        app.logger.error(f"Error fetching teams: {e}")
        return jsonify({"error": "팀 목록 조회 중 오류 발생"}), 500

@app.route('/api/teams/<int:team_id>', methods=['GET'])
def get_team(team_id):
    team = Team.query.get_or_404(team_id)
    # 멤버 및 게임 정보 포함 여부 결정
    return jsonify(team.to_dict(include_members=True, include_games=True)), 200

@app.route('/api/teams/<int:team_id>', methods=['PUT'])
def update_team(team_id):
    team = Team.query.get_or_404(team_id)
    data = request.get_json()

    new_name = data.get('name', team.name)
    # 이름 변경 시 중복 확인 (자기 자신 제외)
    if new_name != team.name and Team.query.filter(Team.name == new_name, Team.id != team_id).first():
        return jsonify({"error": "이미 사용 중인 팀 이름입니다."}), 400
        
    team.name = new_name
    team.description = data.get('description', team.description)
    
    # 멤버 업데이트 (선택적 기능, 여기서는 단순화)
    # data.get('member_ids') 등으로 받아서 기존 멤버와 비교 후 추가/삭제 로직 필요

    try:
        db.session.commit()
        return jsonify(team.to_dict(include_members=True)), 200
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error updating team: {e}")
        return jsonify({"error": "팀 정보 수정 중 오류 발생"}), 500

@app.route('/api/teams/<int:team_id>', methods=['DELETE'])
def delete_team(team_id):
    team = Team.query.get_or_404(team_id)
    
    # 연결된 게임이 있는지 확인 (삭제 정책 결정 필요: null로 만들거나, 삭제 막거나)
    if Game.query.filter((Game.home_team_id == team_id) | (Game.away_team_id == team_id)).first():
        return jsonify({"error": "팀이 참여한 게임이 있어 삭제할 수 없습니다. 해당 게임을 먼저 처리해주세요."}), 400
        
    try:
        # 멤버 관계는 자동으로 처리됨 (secondary table)
        db.session.delete(team)
        db.session.commit()
        return jsonify({"message": "팀이 성공적으로 삭제되었습니다."}), 200
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error deleting team: {e}")
        return jsonify({"error": "팀 삭제 중 오류 발생"}), 500

# --- 게임 API ---
@app.route('/api/games', methods=['POST'])
def create_game():
    data = request.get_json()
    date_time_str = data.get('date_time')
    court_id = data.get('court_id')
    host_id = data.get('host_id')
    home_team_id = data.get('home_team_id') # 변경: String ID 대신 Integer ID
    away_team_id = data.get('away_team_id') # 변경: String ID 대신 Integer ID
    status = data.get('status', GameStatus.SCHEDULED)

    if not date_time_str or not court_id or not host_id: # home/away 팀은 선택적일 수 있음
        return jsonify({"error": "날짜/시간, 코트 ID, 호스트 ID는 필수입니다."}), 400

    try:
        date_time_obj = datetime.datetime.fromisoformat(date_time_str)
    except ValueError:
        return jsonify({"error": "잘못된 날짜/시간 형식입니다. ISO 형식을 사용해주세요."}), 400

    if not Court.query.get(court_id): return jsonify({"error": f"코트 ID {court_id}를 찾을 수 없습니다."}), 404
    if not User.query.get(host_id): return jsonify({"error": f"사용자 ID {host_id}를 찾을 수 없습니다."}), 404
    if home_team_id and not Team.query.get(home_team_id): return jsonify({"error": f"홈 팀 ID {home_team_id}를 찾을 수 없습니다."}), 404
    if away_team_id and not Team.query.get(away_team_id): return jsonify({"error": f"어웨이 팀 ID {away_team_id}를 찾을 수 없습니다."}), 404
    if home_team_id and away_team_id and home_team_id == away_team_id: return jsonify({"error": "홈 팀과 어웨이 팀은 같을 수 없습니다."}), 400
        
    new_game = Game(
        date_time=date_time_obj, 
        court_id=court_id, 
        host_id=host_id,
        home_team_id=home_team_id, # 변경
        away_team_id=away_team_id, # 변경
        status=status
    )
    try:
        db.session.add(new_game)
        db.session.commit()
        return jsonify(new_game.to_dict(include_court=True, include_host=True, include_full_teams=True)), 201
    except Exception as e:
        db.session.rollback(); app.logger.error(f"Error creating game: {e}"); return jsonify({"error": "게임 생성 중 오류 발생"}), 500

@app.route('/api/games', methods=['GET'])
def get_games():
    try:
        games = Game.query.all()
        return jsonify([game.to_dict(include_court=True, include_host=True, include_full_teams=True) for game in games]), 200
    except Exception as e:
        app.logger.error(f"Error fetching games: {e}"); return jsonify({"error": "게임 목록 조회 중 오류 발생"}), 500

@app.route('/api/games/<int:game_id>', methods=['GET'])
def get_game(game_id):
    game = Game.query.get_or_404(game_id)
    return jsonify(game.to_dict(include_court=True, include_host=True, include_full_teams=True)), 200

@app.route('/api/games/<int:game_id>', methods=['PUT'])
def update_game(game_id):
    game = Game.query.get_or_404(game_id)
    data = request.get_json()

    if 'date_time' in data:
        try: game.date_time = datetime.datetime.fromisoformat(data['date_time'])
        except ValueError: return jsonify({"error": "잘못된 날짜/시간 형식입니다. ISO 형식을 사용해주세요."}), 400
    
    game.status = data.get('status', game.status)
    game.court_id = data.get('court_id', game.court_id) # 코트 변경 가능하도록
    game.host_id = data.get('host_id', game.host_id) # 호스트 변경 가능하도록

    new_home_team_id = data.get('home_team_id', game.home_team_id)
    new_away_team_id = data.get('away_team_id', game.away_team_id)

    if new_home_team_id and new_away_team_id and new_home_team_id == new_away_team_id:
        return jsonify({"error": "홈 팀과 어웨이 팀은 같을 수 없습니다."}), 400
    
    # ID 유효성 검사
    if 'court_id' in data and not Court.query.get(game.court_id): return jsonify({"error": f"코트 ID {game.court_id}를 찾을 수 없습니다."}), 404
    if 'host_id' in data and not User.query.get(game.host_id): return jsonify({"error": f"사용자 ID {game.host_id}를 찾을 수 없습니다."}), 404
    if new_home_team_id and not Team.query.get(new_home_team_id): return jsonify({"error": f"홈 팀 ID {new_home_team_id}를 찾을 수 없습니다."}), 404
    if new_away_team_id and not Team.query.get(new_away_team_id): return jsonify({"error": f"어웨이 팀 ID {new_away_team_id}를 찾을 수 없습니다."}), 404

    game.home_team_id = new_home_team_id
    game.away_team_id = new_away_team_id
    
    try:
        db.session.commit()
        return jsonify(game.to_dict(include_court=True, include_host=True, include_full_teams=True)), 200
    except Exception as e:
        db.session.rollback(); app.logger.error(f"Error updating game: {e}"); return jsonify({"error": "게임 정보 수정 중 오류 발생"}), 500

@app.route('/api/games/<int:game_id>', methods=['DELETE'])
def delete_game(game_id):
    game = Game.query.get_or_404(game_id)
    try:
        db.session.delete(game)
        db.session.commit()
        return jsonify({"message": "게임이 성공적으로 삭제되었습니다."}), 200
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error deleting game: {e}")
        return jsonify({"error": "게임 삭제 중 오류 발생"}), 500

# 애플리케이션 컨텍스트 내에서 데이터베이스 테이블 생성 및 테스트 데이터 추가
with app.app_context():
    db.create_all()
    # 테스트 사용자 (기존과 동일하게 생성 또는 업데이트)
    user1 = User.query.filter_by(email='test@example.com').first()
    if not user1:
        user1 = User(email='test@example.com', password_hash=generate_password_hash('password123'), name='Test User')
        db.session.add(user1)
    elif not user1.password_hash or not user1.password_hash.startswith('$pbkdf2-sha256'):
        user1.password_hash = generate_password_hash('password123')

    user2 = User.query.filter_by(email='another@example.com').first()
    if not user2:
        user2 = User(email='another@example.com', password_hash=generate_password_hash('another123'), name='Another User')
        db.session.add(user2)
    
    db.session.commit() # 사용자 먼저 커밋

    # 테스트 코트 (기존과 동일)
    court1 = Court.query.filter_by(name="플랩 스타디움").first()
    if not court1:
        court1 = Court(name="플랩 스타디움", address="서울시 강남구 테헤란로 123", description="최신 시설의 농구 코트입니다.")
        db.session.add(court1)
    court2 = Court.query.filter_by(name="점프 아레나").first()
    if not court2:
        court2 = Court(name="점프 아레나", address="서울시 서초구 반포대로 456", description="프로 선수들이 사용하는 코트입니다.")
        db.session.add(court2)
    db.session.commit() # 코트 커밋

    # 테스트 팀 추가
    team_alpha = Team.query.filter_by(name="Alpha Team").first()
    if not team_alpha:
        team_alpha = Team(name="Alpha Team", description="The A team.")
        team_alpha.members.append(user1) # user1을 Alpha Team 멤버로
        db.session.add(team_alpha)

    team_beta = Team.query.filter_by(name="Beta Team").first()
    if not team_beta:
        team_beta = Team(name="Beta Team", description="The B team.")
        team_beta.members.append(user2) # user2를 Beta Team 멤버로
        db.session.add(team_beta)
    
    team_gamma = Team.query.filter_by(name="Gamma Team").first()
    if not team_gamma:
        team_gamma = Team(name="Gamma Team", description="The G team.")
        # user1, user2 모두 Gamma Team 멤버로
        team_gamma.members.append(user1)
        team_gamma.members.append(user2)
        db.session.add(team_gamma)

    db.session.commit() # 팀 커밋 (멤버 관계 포함)

    # 테스트 게임 데이터 (팀 ID 사용하도록 수정)
    if Game.query.count() == 0:
        if user1 and court1 and team_alpha and team_beta:
            game1 = Game(
                date_time=datetime.datetime.now() + datetime.timedelta(days=7),
                court_id=court1.id,
                host_id=user1.id,
                home_team_id=team_alpha.id, 
                away_team_id=team_beta.id,
                status=GameStatus.SCHEDULED
            )
            db.session.add(game1)
        
        if user2 and court2 and team_gamma and team_alpha: # team_alpha가 어웨이팀으로 참여
            game2 = Game(
                date_time=datetime.datetime.now() + datetime.timedelta(days=10),
                court_id=court2.id,
                host_id=user2.id,
                home_team_id=team_gamma.id,
                away_team_id=team_alpha.id,
                status=GameStatus.SCHEDULED
            )
            db.session.add(game2)
        db.session.commit() # 게임 커밋

if __name__ == '__main__':
    app.run(debug=True) 