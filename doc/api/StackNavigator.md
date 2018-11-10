# createBottomTabNavigator

- createStackNavigator(RouteConfigs,StackNavigatorConfig)

## 1. RouteConfigs

- createStackNavigator({
  Profile:{
    screen: ProfileScreen,
    path: '/:name',
    navigationOptions: ({navigation,screenProps}) => ({
      title: `${navigation.state.params.name}'s profile`
    })
  }
})

## 2. StackNavigatorConfig

### 2.1 路由相关
- initialRouteName： 首次加载时，用来第一个展示的路由的名字

- initialRouteParams：初始路由的参数

- initialRouteKey：初始路由的可选标识符

- navigationOptions：用于 所有 屏幕的默认导航选项

- paths：提供 routeName 到 path config 的映射，该映射覆盖 routeConfigs 中设置的路径

### 2.2 视觉相关

- mode：定义渲染和过渡的样式
* card：使用标准的 ios  和 android 屏幕过渡 （默认值）
* modal：使用屏幕从底部滑入，仅适用 ios

- headerMode：指定 头部导航栏 的样式
* float：渲染单个标题，保持在顶部，并在屏幕更改时设置动画。ios 常见模式
* screen：每个屏幕都有一个标题，屏幕与标题一起淡入淡出。android的常见模式
* none：不显示标题

- headerBackTitleVisiable： 后退按钮标题 true 显示， false 隐藏

- headerTransitionPreset：指定 float
* fade-in-place：默认值
* uikit：ios的默认行为的近似值

- headerLayoutPreset：指定如何布局标题组件
* left：将标题锚定在左侧，靠近后退按钮或其他左侧组件。
        这是 Android 上的默认设置。在iOS上使用时，隐藏标题后退标题。
        左侧组件中的内容将溢出标题下方，如果您需要调整此内容，
        则可以使用 headerLeftContainerStyle 和 headerTitleContainerStyle 。
        此外，此对齐与此不兼容 headerTransitionPreset: 'uikit'。
* center：将标题居中，这是 ios 上的默认设置

- cardStyle：相当于 当前屏幕的最外层容器，可设置样式

- transitionConfig:(transitionProps,prevTransitionProps,isModal)=>{}

- onTransitionStart：屏幕转换动画即将开始时调用的函数

- onTransitonEnd:

- transparentCard --> 测试中

## 3. navigationOptions 用于导航器内的屏幕

- title： 页面头部 标题

- header：react Element或给定HeaderProps返回React元素的函数，显示为标题。设置为null隐藏标题。

- headerTitle: 标题使用的字符串，反应元素或反应组件。
                默认为场景title。
                当使用的成分，它接收allowFontScaling，style和children道具。传递标题字符串children。

- headerTitleAllowFontScaling：默认为 true

- headerBackImage: ({tintColor,title // 上个屏幕的 后退标题}) => {}

- headerBackTitle: 后退标题 必须在原始屏幕定义，而不是在目标屏幕定义

- headerTruncatedBackTitle：当标题过长时使用，在原始屏幕中使用

- headerRight: React Element

- headerLeft:(onPress,title,titleStyle...)=>{} 或 React Element

- headerStyle：头部导航 的 最外层容器的样式

- headerForceInset：允许将forceInset对象传递给标头中使用的内部SafeAreaView。

- headerTitleStyle: 标题组件的样式

- headerBackTitleStyle: 后退标题组件的样式

- headerLeftContainerStyle：自定义 headerLeft 组件容器的样式

- headerRightContainerStyle:

- headerTitleContainerStyle:

- headerTintColor：标题的色调

- headerPressColor: 材质波纹的颜色 （Android >= 5.0）

- headerTransparent: 默认为 false，为 true 则 透明

- headerBackground： 使用 上面的属性，配合 模糊试图，可以创建半透明的标题

- gesturesEnabled：可否使用手势来关闭屏幕。 ios 上默认为 true，在 Android 上默认为 false

- gestureResponseDistance：
* horizontal 默认 25
* vertical 默认 135

- gestureDirection：default 正常方向， inverted 从右向左滑动

## 4. 堆栈组件可接收 的 额外参数，这些参数将传递给子屏幕

~~~javascript
const AppNavigator = createStackNavigator({...})

App.js

<AppNavigator 
  screenProps={...}
>
~~~
