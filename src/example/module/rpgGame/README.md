# rpg

## components

动作行为

基类：Component

类型：ComponentType

管理器：ComponentSystem

这是场景相关的处理，在管理器中会每帧触发每个Component的运行，而每个Component都会挂载场景实体身上去，Component的运行也就控制了场景实体的动作行为。

从直线思维的角度思考，游戏内我们应该控制每个场景实体的动作行为的，这才是我们最真实的感受。但是每个场景实体很多动作行为都是相似或相同的，比如模型，移动，战斗，技能。

每个场景实体都是一套控制管理器那就很麻烦了，我们把这些动作行为提取出来，让它们挂载到场景实体上，而我们只控制这些动作行为就好。

## object

场景实体

基类：RpgGameObject

玩家：RpgPlayer

妖怪：RpgMonster

其他：RpgNpc, RpgDrop

每个场景实体都是含有多个动作行为，这些动作行为都需要挂载到实体上，我们控制动作行为即可。