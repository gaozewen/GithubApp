# createBottomTabNavigator

- createBottomTabNavigator(RouteConfigs,BottomTabNavigatorConfig)

## 1. RouteConfigs

- route configs 对象是从了路由名称到路由配置的映射，仿StackNavigator

## 2. BottomTabNavigatorConfig
- initialRouteName： 首次加载时，用来第一个展示的路由的名字

- order：routeNames 数组，用于定义选项卡的顺序

- paths：提供 routeName 到 path config 的映射，该映射覆盖 routeConfigs 中设置的路径

- backBehavior：后退按钮是否会导致选项卡切换到初始选项卡？ 如果是 则 设置 initialRoute(默认)，否则 none。

- tabBarConmpoentn: 可选，覆盖用作标签栏的组件

- tabBarOptions：配置如下

### 2 tabBarOptions

- activeTintColor： 活动选项卡的标签和图标颜色

- activeBackgroundColor：活动选项卡的背景颜色

- inactiveTintColor：非活动选项卡的标签和图标颜色

- inactiveBakgroundColor：非活动选项卡的背景颜色

- showLabel： 是否显示标签名， 默认为 true

- showIcon：是否显示选项卡的图标，默认 false

- style： 标签栏的样式

- labelStyle：标签名 的样式

- tabStyle：选项卡的样式对象

- allowFontScaling：标签字体是否应缩放以符合文本大小，默认 true

- safeAreaInset：覆盖 <SafeAreaView> 的 forceInset props。默认为 {bottom:'always',top:'never'}.
                 可替换为 top/bottom/left/right

## 3. navigationOptions 用于导航器内的屏幕

- title： 页面头部 标题

- tabBarVisible：显示 或 隐藏 标签栏，未设置，默认为 true

- tabBarIcon：{focused:boolean,horizatal:boolean,tintColor:string}

- tabBarLabel: {focused:boolean,tintColor:string}

- tabBarButtomCompoent: <TouchableNativeFeedback>

~~~javascript
<TouchableHighlight onPress={this._onPressButton}>
  <Image
    style={styles.button}
    source={require('./myButton.png')}
  />
</TouchableHighlight>

<TouchableOpacity onPress={this._onPressButton}>
</TouchableOpacity>

<TouchableWithoutFeedback/>

<!-- 仅限安卓 -->
<TouchableNativeFeedback
    onPress={this._onPressButton}
    background={TouchableNativeFeedback.SelectableBackground()}>
  <View style={{width: 150, height: 100, backgroundColor: 'red'}}>
    <Text style={{margin: 30}}>Button</Text>
  </View>
</TouchableNativeFeedback>


~~~

- tabBarOnPress:
~~~javascript
tabBarOnPress:({ 
  navigation, // 屏幕导航道具
  defaultHandler // tab按下的默认处理程序
})=>{
  // 用域在转换到下一个场景之前 添加自定义逻辑
}
~~~
