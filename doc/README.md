git checkout 0.42-stable

https://github.com/reactnativecn

components      组件
logics          业务
pages           页面
utils           工具
# 脚手架指定项目

- react-native init MyApp --version 0.43.0-rc.2

# 如何规范项目代码

- https://www.npmjs.com/package/eslint-config-airbnb
- npm i -D babel-eslint
- .eslintrc
- http://t.cn/RtE9SS3

# 模拟器下载

- https://www.genymotion.com/download/

# 连接模拟器
    ctrl + m
- adb shell input keyevent 82 // 打开控制菜单
- adb reverse tcp:8081 tcp:8081
- [ip]:8081 //改端口号
- 修改或者添加依赖之后 重新 npm start，然后 reload

# Fetch


# 0. 初始化项目

1. copy .editorconfig

2. use eslint

~~~
yarn add babel-eslint eslint eslint-config-airbnb eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react
~~~

3. copy .eslintrc

# 1. git 和远程分支关联
    git remote add origin 
    
    git@gitee.com:gaozewen/rn-novel.git
    
    git push -u origin master

# 2. 安装项目依赖包
~~~javascript
    
~~~

# 3. 常规操作

1. android/settings.gradle

2. android/app/build.gradle

    dependencies
  
3. Register module in MainApplication.java

4. Implement onConfigurationChanged method in MainActivity.java

