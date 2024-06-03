cd web_app || exit
npm ci
npm run build
cp -r dist/ ../iopaint/web_app

cd ..
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
