# 这是一个“构建”配方，会执行 autoPodInstall.command 脚本
publish:
  rm -rf ./dist
  npm run build     
  cp -r ./dist/* ./ 
  git add -A && git commit -m "feat: update pages" && git push
