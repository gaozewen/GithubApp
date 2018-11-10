# createDrawerbNavigator

- createDrawerNavigator(RouteConfigs,DrawerNavigatorConfig)

## 1. DrawerNavigatorConfig

- drawerWidth：抽屉的宽度 或 返回的功能

- drawerPosition：left 或 right，默认 left

- cententComponent：可自定义，默认为 <DrawerItems/>

- contentOptions：配置抽屉内容，看下面

- useNativeAnimations：启用原生动画，默认是 true

- drawerBackgroundColor：默认是 white

下面的传递给底层路由，以修改导航逻辑

- initialRouteName： 首次加载时，用来第一个展示的路由的名字

- order：routeNames 数组，用来定义抽屉项目的顺序

- paths：提供 routeName 到 path config 的映射，该映射覆盖 routeConfigs 中设置的路径

- backBehavior：后退按钮是否应该切换到初始路线？ 如果是 则 initialRoute（默认） 否则 none

### 1.1 定制的 contentCompoent

~~~javascript
import { DrawerItems, SafeAreaView } from 'react-navigation';

const CustomDrawerContentComponent = (props) => (
  <ScrollView>
    <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
      <DrawerItems {...props} />
    </SafeAreaView>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
~~~

### 1.2 contentOptions 用于配置 DrawerItems

- items：修改或覆盖路由数组

- activeItemKey：用来识别 被选中 路由 key 值

- activeTintColor：选中 的 那个标签的标签和图标颜色

- activeBackgroundColor：选中的 标签的背景颜色

- inactiveTintColor

- inactiveBackgroundColor

- onItemPress(route)：按下 该标签时调用的函数

- itemsContainerStyle：内容部分的样式

- itemStyle：单个项目的样式，可以包含图标 和 标签

- labelStyle：当 Text 标签 时字符串是，覆盖其样式

- activeLabelStyle：

- inactiveLabelStyle

- iconContainerStyle：覆盖 View 的样式

## 3. 屏幕内部

- title：通用标题，可用左别用的 headerTitle 和 drawerLabel

- drawerLabel：String， React Element， 或 ({focused:boolean,tintColor:string)=>{}

- drawerIcon：({focused:boolean,tintColor:string)=>{}

- drawerLockMode: 指定抽屉的 锁定模式，可以在顶极路由上使用 screenProps.drawerLockMode动态更新

