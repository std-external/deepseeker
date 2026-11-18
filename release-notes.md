把第五章的 Seeker 换成蓝色大肥鱼。

**安装**：需要 Everest ≥ 1.4.0。把 `DeepSeeker-0.1.0.zip` 丢进 `Celeste/Mods/`（或解压后把 `DeepSeeker` 文件夹放进去），重启游戏即可。没有设置项。

**内容**：覆盖原版 seeker 的 152 张 predator 帧 + 11 张 rebirth 帧，每张 96x96（与原帧同 frame size）。游动 / 发现 / 冲刺 / 撞墙 / 被打晕 / 眩晕 / 孵化 / 复活都有对应贴图，朝向翻转和缩放沿用原版逻辑。

**说明**：纯贴图替换（Everest 的 `Graphics/Atlases/Gameplay/` 覆盖机制），没有代码、没有 dll、不改地图；shockwave 圈仍是原版。贴图由 `tools/gen_sprites.mjs` 生成，想改配色/表情直接改脚本重跑。
