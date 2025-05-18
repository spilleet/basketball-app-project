from flask import Flask, jsonify, request, render_template
import os
import json
import atexit

# 템플릿 폴더 경로 설정
template_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'templates'))
static_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static'))
app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)
app.config['SECRET_KEY'] = 'flap-basketball-secret-key'  # 세션 암호화 키 설정

# 서버 경로 출력
print(f"템플릿 경로: {template_dir}")
print(f"정적 파일 경로: {static_dir}")

# JSON 데이터베이스 파일 경로
DB_FILE = os.path.join(os.path.dirname(__file__), 'db.json')

# 데이터 변수 초기화
users = []
courts = []
teams = []
games = []

# 데이터베이스 파일에서 데이터 불러오기
def load_db():
    global users, courts, teams, games
    try:
        if os.path.exists(DB_FILE):
            with open(DB_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                users = data.get('users', [])
                courts = data.get('courts', [])
                teams = data.get('teams', [])
                games = data.get('games', [])
            print(f"데이터베이스 로드 완료: {len(users)}명의 사용자, {len(courts)}개의 코트, {len(games)}개의 게임")
        else:
            print("데이터베이스 파일이 없습니다. 새로 생성합니다.")
            save_db()
    except Exception as e:
        print(f"데이터베이스 로드 중 오류 발생: {e}")
        # 기본 데이터 설정
        users = [
            {"id": 1, "name": "Test User", "email": "test@example.com", "password": "password123"},
            {"id": 2, "name": "Another User", "email": "another@example.com", "password": "password123"}
        ]
        courts = [
            {"id": 1, "name": "플랩 스타디움", "address": "서울시 강남구 테헤란로 123", "description": "최신 시설의 농구 코트입니다."},
            {"id": 2, "name": "점프 아레나", "address": "서울시 서초구 반포대로 456", "description": "프로 선수들이 사용하는 코트입니다."}
        ]
        teams = [
            {"id": 1, "name": "Alpha Team", "description": "The A team", "member_ids": [1]},
            {"id": 2, "name": "Beta Team", "description": "The B team", "member_ids": [2]}
        ]
        games = [
            {
                "id": 1, 
                "home_team_id": 1, 
                "away_team_id": 2, 
                "court_id": 1, 
                "host_id": 1,
                "date_time": "2024-08-15T18:00:00",
                "status": "SCHEDULED"
            }
        ]
        save_db()

# 데이터를 데이터베이스 파일에 저장
def save_db():
    try:
        with open(DB_FILE, 'w', encoding='utf-8') as f:
            json.dump({
                'users': users,
                'courts': courts,
                'teams': teams,
                'games': games
            }, f, ensure_ascii=False, indent=2)
        print("데이터베이스 저장 완료")
    except Exception as e:
        print(f"데이터베이스 저장 중 오류 발생: {e}")

# 서버 종료 시 데이터 저장
atexit.register(save_db)

# 애플리케이션 시작 시 데이터 로드
load_db()

# 유틸리티 함수
def get_next_id(collection):
    if not collection:
        return 1
    return max(item["id"] for item in collection) + 1

def find_by_id(collection, id):
    for item in collection:
        if item["id"] == id:
            return item
    return None

def remove_by_id(collection, id):
    for i, item in enumerate(collection):
        if item["id"] == id:
            return collection.pop(i)
    return None

# 기본 라우트
@app.route('/')
def hello_world():
    return render_template('index.html')

# 사용자 API
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"error": "이메일과 비밀번호를 모두 입력해주세요."}), 400
    
    # 디버그용 로그 출력
    print(f"로그인 시도: {email}")
    
    # 사용자 목록에서 이메일로 사용자 찾기
    for user in users:
        if user["email"] == email and user["password"] == password:
            # 비밀번호를 제외한 사용자 정보 반환
            user_info = {k: v for k, v in user.items() if k != 'password'}
            return jsonify(user_info), 200
    
    # 일치하는 사용자가 없는 경우
    return jsonify({"error": "이메일 또는 비밀번호가 일치하지 않습니다."}), 401

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    
    # 디버그용 로그 출력
    print(f"회원가입 시도: 이메일={email}, 이름={name}")
    
    if not email or not password or not name:
        return jsonify({"error": "이메일, 비밀번호, 이름을 모두 입력해주세요."}), 400
        
    # 이메일 중복 확인
    if any(user["email"] == email for user in users):
        print(f"회원가입 실패: 이메일 {email} 중복")
        return jsonify({"error": "이미 사용 중인 이메일입니다."}), 400
    
    # 새 사용자 추가
    new_user = {
        "id": get_next_id(users),
        "email": email,
        "name": name,
        "password": password  # 실제로는 비밀번호 해싱 필요
    }
    users.append(new_user)
    
    # 데이터베이스에 변경사항 저장
    save_db()
    
    print(f"회원가입 성공: ID={new_user['id']}, 이메일={email}")
    
    # 비밀번호를 제외한 사용자 정보 반환
    user_info = {k: v for k, v in new_user.items() if k != 'password'}
    return jsonify(user_info), 201

@app.route('/api/users', methods=['GET'])
def get_users():
    # 비밀번호 필드 제외하고 반환
    safe_users = [{k: v for k, v in user.items() if k != 'password'} for user in users]
    return jsonify(safe_users)

# 코트 API
@app.route('/api/courts', methods=['GET'])
def get_courts():
    return jsonify(courts)

@app.route('/api/courts/<int:court_id>', methods=['GET'])
def get_court(court_id):
    court = find_by_id(courts, court_id)
    if not court:
        return jsonify({"error": "코트를 찾을 수 없습니다."}), 404
    return jsonify(court)

@app.route('/api/courts', methods=['POST'])
def create_court():
    data = request.get_json()
    name = data.get('name')
    address = data.get('address')
    description = data.get('description', '')
    
    if not name or not address:
        return jsonify({"error": "이름과 주소는 필수 항목입니다."}), 400
    
    new_court = {
        "id": get_next_id(courts),
        "name": name,
        "address": address,
        "description": description
    }
    courts.append(new_court)
    
    # 데이터베이스에 변경사항 저장
    save_db()
    
    return jsonify(new_court), 201

@app.route('/api/courts/<int:court_id>', methods=['PUT'])
def update_court(court_id):
    court = find_by_id(courts, court_id)
    if not court:
        return jsonify({"error": "코트를 찾을 수 없습니다."}), 404
        
    data = request.get_json()
    court["name"] = data.get('name', court["name"])
    court["address"] = data.get('address', court["address"])
    court["description"] = data.get('description', court.get("description", ''))
    
    # 데이터베이스에 변경사항 저장
    save_db()
    
    return jsonify(court)

@app.route('/api/courts/<int:court_id>', methods=['DELETE'])
def delete_court(court_id):
    court = remove_by_id(courts, court_id)
    if not court:
        return jsonify({"error": "코트를 찾을 수 없습니다."}), 404
    
    # 연관된 게임 데이터 처리 (실제로는 이런 방식 보다 더 정교한 처리 필요)
    games_to_remove = []
    for i, game in enumerate(games):
        if game["court_id"] == court_id:
            games_to_remove.append(i)
    
    # 뒤에서부터 삭제 (인덱스 문제 방지)
    for i in sorted(games_to_remove, reverse=True):
        games.pop(i)
    
    # 데이터베이스에 변경사항 저장    
    save_db()
        
    return jsonify({"message": "코트가 성공적으로 삭제되었습니다."})

# 팀 API
@app.route('/api/teams', methods=['GET'])
def get_teams():
    return jsonify(teams)

@app.route('/api/teams/<int:team_id>', methods=['GET'])
def get_team(team_id):
    team = find_by_id(teams, team_id)
    if not team:
        return jsonify({"error": "팀을 찾을 수 없습니다."}), 404
    return jsonify(team)

@app.route('/api/teams', methods=['POST'])
def create_team():
    data = request.get_json()
    name = data.get('name')
    description = data.get('description', '')
    member_ids = data.get('member_ids', [])
    
    if not name:
        return jsonify({"error": "팀 이름은 필수 항목입니다."}), 400
        
    # 팀 이름 중복 확인
    if any(team["name"] == name for team in teams):
        return jsonify({"error": "이미 사용 중인 팀 이름입니다."}), 400
    
    new_team = {
        "id": get_next_id(teams),
        "name": name,
        "description": description,
        "member_ids": member_ids
    }
    teams.append(new_team)
    
    # 데이터베이스에 변경사항 저장
    save_db()
    
    return jsonify(new_team), 201

@app.route('/api/teams/<int:team_id>', methods=['PUT'])
def update_team(team_id):
    team = find_by_id(teams, team_id)
    if not team:
        return jsonify({"error": "팀을 찾을 수 없습니다."}), 404
        
    data = request.get_json()
    new_name = data.get('name', team["name"])
    
    # 이름 변경 시 중복 확인
    if new_name != team["name"] and any(t["name"] == new_name and t["id"] != team_id for t in teams):
        return jsonify({"error": "이미 사용 중인 팀 이름입니다."}), 400
        
    team["name"] = new_name
    team["description"] = data.get('description', team.get("description", ''))
    if 'member_ids' in data:
        team["member_ids"] = data["member_ids"]
    
    # 데이터베이스에 변경사항 저장
    save_db()
    
    return jsonify(team)

@app.route('/api/teams/<int:team_id>', methods=['DELETE'])
def delete_team(team_id):
    team = remove_by_id(teams, team_id)
    if not team:
        return jsonify({"error": "팀을 찾을 수 없습니다."}), 404
    
    # 연관된 게임 데이터 처리
    games_to_remove = []
    for i, game in enumerate(games):
        if game["home_team_id"] == team_id or game["away_team_id"] == team_id:
            games_to_remove.append(i)
    
    for i in sorted(games_to_remove, reverse=True):
        games.pop(i)
    
    # 데이터베이스에 변경사항 저장
    save_db()
        
    return jsonify({"message": "팀이 성공적으로 삭제되었습니다."})

# 게임 API
@app.route('/api/games', methods=['GET'])
def get_games():
    # 연결된 데이터도 포함하여 반환
    result = []
    for game in games:
        game_data = dict(game)  # 복사본 생성
        
        # 코트 정보 추가
        court = find_by_id(courts, game["court_id"])
        if court:
            game_data["court"] = court
            
        # 홈팀, 어웨이팀 정보 추가
        home_team = find_by_id(teams, game["home_team_id"])
        away_team = find_by_id(teams, game["away_team_id"])
        if home_team:
            game_data["home_team"] = home_team
        if away_team:
            game_data["away_team"] = away_team
            
        # 호스트 정보 추가
        host = find_by_id(users, game["host_id"])
        if host:
            # 비밀번호 제외
            host_info = {k: v for k, v in host.items() if k != 'password'}
            game_data["host"] = host_info
            
        result.append(game_data)
    
    return jsonify(result)

@app.route('/api/games/<int:game_id>', methods=['GET'])
def get_game(game_id):
    game = find_by_id(games, game_id)
    if not game:
        return jsonify({"error": "게임을 찾을 수 없습니다."}), 404
        
    # 연결된 데이터도 포함하여 반환
    game_data = dict(game)  # 복사본 생성
    
    # 코트 정보 추가
    court = find_by_id(courts, game["court_id"])
    if court:
        game_data["court"] = court
        
    # 홈팀, 어웨이팀 정보 추가
    home_team = find_by_id(teams, game["home_team_id"])
    away_team = find_by_id(teams, game["away_team_id"])
    if home_team:
        game_data["home_team"] = home_team
    if away_team:
        game_data["away_team"] = away_team
        
    # 호스트 정보 추가
    host = find_by_id(users, game["host_id"])
    if host:
        # 비밀번호 제외
        host_info = {k: v for k, v in host.items() if k != 'password'}
        game_data["host"] = host_info
    
    return jsonify(game_data)

@app.route('/api/games', methods=['POST'])
def create_game():
    data = request.get_json()
    date_time = data.get('date_time')
    court_id = data.get('court_id')
    host_id = data.get('host_id')
    home_team_id = data.get('home_team_id')
    away_team_id = data.get('away_team_id')
    status = data.get('status', 'SCHEDULED')
    
    if not date_time or not court_id or not host_id:
        return jsonify({"error": "날짜/시간, 코트 ID, 호스트 ID는 필수입니다."}), 400
        
    # 참조 ID 유효성 검사
    if not find_by_id(courts, court_id):
        return jsonify({"error": f"코트 ID {court_id}를 찾을 수 없습니다."}), 404
    if not find_by_id(users, host_id):
        return jsonify({"error": f"사용자 ID {host_id}를 찾을 수 없습니다."}), 404
    if home_team_id and not find_by_id(teams, home_team_id):
        return jsonify({"error": f"홈 팀 ID {home_team_id}를 찾을 수 없습니다."}), 404
    if away_team_id and not find_by_id(teams, away_team_id):
        return jsonify({"error": f"어웨이 팀 ID {away_team_id}를 찾을 수 없습니다."}), 404
    if home_team_id and away_team_id and home_team_id == away_team_id:
        return jsonify({"error": "홈 팀과 어웨이 팀은 같을 수 없습니다."}), 400
    
    new_game = {
        "id": get_next_id(games),
        "date_time": date_time,
        "court_id": court_id,
        "host_id": host_id,
        "home_team_id": home_team_id,
        "away_team_id": away_team_id,
        "status": status
    }
    games.append(new_game)
    
    # 데이터베이스에 변경사항 저장
    save_db()
    
    # 연결된 데이터도 포함하여 반환
    game_data = dict(new_game)
    
    # 코트 정보 추가
    court = find_by_id(courts, court_id)
    if court:
        game_data["court"] = court
        
    # 홈팀, 어웨이팀 정보 추가
    home_team = find_by_id(teams, home_team_id) if home_team_id else None
    away_team = find_by_id(teams, away_team_id) if away_team_id else None
    if home_team:
        game_data["home_team"] = home_team
    if away_team:
        game_data["away_team"] = away_team
        
    # 호스트 정보 추가
    host = find_by_id(users, host_id)
    if host:
        # 비밀번호 제외
        host_info = {k: v for k, v in host.items() if k != 'password'}
        game_data["host"] = host_info
    
    return jsonify(game_data), 201

@app.route('/api/games/<int:game_id>', methods=['PUT'])
def update_game(game_id):
    game = find_by_id(games, game_id)
    if not game:
        return jsonify({"error": "게임을 찾을 수 없습니다."}), 404
        
    data = request.get_json()
    
    # 필드 업데이트
    if 'date_time' in data:
        game["date_time"] = data["date_time"]
    if 'status' in data:
        game["status"] = data["status"]
    
    # court_id 변경 시 유효성 검사
    if 'court_id' in data:
        court_id = data["court_id"]
        if not find_by_id(courts, court_id):
            return jsonify({"error": f"코트 ID {court_id}를 찾을 수 없습니다."}), 404
        game["court_id"] = court_id
    
    # host_id 변경 시 유효성 검사
    if 'host_id' in data:
        host_id = data["host_id"]
        if not find_by_id(users, host_id):
            return jsonify({"error": f"사용자 ID {host_id}를 찾을 수 없습니다."}), 404
        game["host_id"] = host_id
    
    # 팀 ID 변경 시 유효성 검사
    new_home_team_id = data.get('home_team_id', game["home_team_id"])
    new_away_team_id = data.get('away_team_id', game["away_team_id"])
    
    if new_home_team_id != game["home_team_id"]:
        if not find_by_id(teams, new_home_team_id):
            return jsonify({"error": f"홈 팀 ID {new_home_team_id}를 찾을 수 없습니다."}), 404
    
    if new_away_team_id != game["away_team_id"]:
        if not find_by_id(teams, new_away_team_id):
            return jsonify({"error": f"어웨이 팀 ID {new_away_team_id}를 찾을 수 없습니다."}), 404
    
    if new_home_team_id and new_away_team_id and new_home_team_id == new_away_team_id:
        return jsonify({"error": "홈 팀과 어웨이 팀은 같을 수 없습니다."}), 400
        
    game["home_team_id"] = new_home_team_id
    game["away_team_id"] = new_away_team_id
    
    # 데이터베이스에 변경사항 저장
    save_db()
    
    # 연결된 데이터도 포함하여 반환
    game_data = dict(game)
    
    # 코트 정보 추가
    court = find_by_id(courts, game["court_id"])
    if court:
        game_data["court"] = court
        
    # 홈팀, 어웨이팀 정보 추가
    home_team = find_by_id(teams, game["home_team_id"])
    away_team = find_by_id(teams, game["away_team_id"])
    if home_team:
        game_data["home_team"] = home_team
    if away_team:
        game_data["away_team"] = away_team
        
    # 호스트 정보 추가
    host = find_by_id(users, game["host_id"])
    if host:
        # 비밀번호 제외
        host_info = {k: v for k, v in host.items() if k != 'password'}
        game_data["host"] = host_info
    
    return jsonify(game_data)

@app.route('/api/games/<int:game_id>', methods=['DELETE'])
def delete_game(game_id):
    game = remove_by_id(games, game_id)
    if not game:
        return jsonify({"error": "게임을 찾을 수 없습니다."}), 404
    
    # 데이터베이스에 변경사항 저장
    save_db()
        
    return jsonify({"message": "게임이 성공적으로 삭제되었습니다."})

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000) 