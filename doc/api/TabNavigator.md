# createTabNavigator

- createTabNavigator(RouteConfigs,TabNavigatorConfig)

## 1. RouteConfigs

- route configs 对象是从了路由名称到路由配置的映射，仿StackNavigator

## 2. TabNavigatorConfig

- tabBarComponent: 用作标签栏的组件 TabBarBottom(ios 默认)， TabBarTop(Android默认设置)

- tabBarPosition： 标签栏的位置, top/bottom

- swipEnabled：是否允许在标签之间活动

- animationEnabled: 更改选项卡时是否设置动画

- lazy：默认是 true。如果 false，立即渲染所有选项卡

- removeClippedSubviews：默认 true，通过释放非活动选项卡使用的资源来减少内存使用的优化

- initialLayout： 有 initial，height，width，可防止 react-native-tab-view 呈现一帧延迟

- tabBarOptions：配置如下

### 2.1 tabBarOptions （通用）

- initialRouteName： 首次加载时，用来第一个展示的路由的名字

- order：routeNames 数组，用于定义选项卡的顺序

- paths：提供 routeName 到 path config 的映射，该映射覆盖 routeConfigs 中设置的路径

- backBehavior：后退按钮是否会导致选项卡切换到初始选项卡？ 如果是 则 设置 initialRoute(默认)，否则 none。

### 2.2 tabBarOptions for TabBarBottom (ios的默认标签栏)

- activeTintColor： 活动选项卡的标签和图标颜色

- activeBackgroundColor：活动选项卡的背景颜色

- inactiveTintColor：非活动选项卡的标签和图标颜色

- inactiveBakgroundColor：非活动选项卡的背景颜色

- showLabel： 是否显示标签名， 默认为 true

- style： 标签栏的样式

- labelStyle：标签名 的样式

- tabStyle：选项卡的样式对象

- allowFontScaling：标签字体是否应缩放以符合文本大小，默认 true

- safeAreaInset：覆盖 <SafeAreaView> 的 forceInset props。默认为 {bottom:'always',top:'never'}.
                 可替换为 top/bottom/left/right

### 2.3 tabBarOptions for TabBarTop (Android 上的默认标签栏)

- activeTintColor：活动选项卡的标签和图标颜色

- inactiveTintColor: 非活动选项啊看的标签和图标颜色

- showIcon：是否显示选项卡的图标，默认 false

- showLabel：是否显示标签名，默认是 true

- upperCaseLabel：是否标签名大写，默认是 true

- pressColor：材质波纹的颜色 (Android>=仅限5.0)

- pressOpacty：按下选项卡的不透明度(仅适用于 ios 和 Android < 5.0>)

- scrollEnabled：是否启用可滚动的选项卡

- tabStyle： 选项卡的样式对象

- indicatorStyle：选项卡指示器的样式对象 （选项卡底部的行）

- labelStyle：选项卡标签的样式对象

- iconStyle：选项卡图标的样式对象

- style：选项卡的样式对象

- allowFontScaling：标签字体是否应缩放以符合文本大小，默认 true

## 3. navigationOptions 用于导航器内的屏幕

- title： 页面头部 标题

- tabBarVisible：显示 或 隐藏 标签栏，未设置，默认为 true

- swipEnabled：是否允许 导航栏滑动，未设置，默认使用 TabNavigatorConfig 里面的 swipEnabled 选项

- tabBarIcon：{focused:boolean,horizatal:boolean,tintColor:string}

- tabBarLabel: {focused:boolean,tintColor:string}

- tabBarOnPress:
~~~javascript
tabBarOnPress:({route,index},jumpToIndex)=>{
  // 只有调用 jumpToIndex 方法之后才会真正的跳转页面
  jumpToIndex(index)
}
~~~
