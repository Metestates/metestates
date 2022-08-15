npm run build
npm run export
touch ./build/.nojekyll
cp ./CNAME ./build/CNAME
gh-pages -d build -t true
