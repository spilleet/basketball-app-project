from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return '테스트 서버가 정상 작동 중입니다!'

if __name__ == '__main__':
    # host='0.0.0.0'으로 설정하면 모든 네트워크 인터페이스에서 접근 가능
    app.run(debug=True, host='0.0.0.0', port=8080) 