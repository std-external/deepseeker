#import "@local/orange:0.1.0": *
#show: orange.with(
  title: [DeepSeeker],
  subtitle: [把《蔚蓝》第五章的 Seeker 换成一条蓝色大肥鱼],
  theme: "dark",
)

#grid(
  columns: (1.1fr, 1fr),
  gutter: 18pt,
  align: horizon,
  [
    #align(center, image("preview/card/orig_seeker.png", width: 100pt))
    #align(center)[#text(size: 9pt, weight: "bold")[改前] #text(size: 9pt, fill: luma(160))[原版 Seeker · 游戏内截图]]
  ],
  [
    #grid(
      columns: (1fr, 1fr),
      gutter: 4pt,
      align: center + horizon,
      image("preview/card/predator01.png", width: 62pt),
      image("preview/card/predator51.png", width: 62pt),
      image("preview/card/predator110.png", width: 62pt),
      image("preview/card/predator136.png", width: 62pt),
    )
    #align(center)[#text(size: 9pt, weight: "bold")[改后] #text(size: 9pt, fill: luma(160))[游动 / 咬人 / 被打晕 / 眩晕]]
  ],
)

#v(2pt)

#callout(kind: "blue", title: [改了什么])[
  覆盖原版 seeker 的 152 张 predator 帧 + 11 张 rebirth 帧，每张都是 *96×96*，和原版帧尺寸一致。
  潜行、发现、冲刺、撞墙、被打晕、孵化、复活全用原版动画和帧序，朝向翻转也跟着原版走。纯贴图，没有 dll。
]

#v(2pt)

#text(size: 10pt, fill: luma(150))[装法（Everest ≥ 1.4.0）]

#steps(
  [把 `DeepSeeker-0.1.0.zip` 丢进 `Celeste/Mods/`],
  [启动游戏，进第五章（镜之寺庙）],
  [看到鱼。想还原就删掉文件夹],
)

#v(2pt)

#text(size: 9pt, fill: luma(140))[
  说明：这台机器跑不起游戏（没有可用的视频输出），右边是贴图预览、不是实机截图；帧尺寸按原版 96×96 生成，shockwave 圈没改。
]

#v(2pt)

#align(center)[
  #text(size: 10pt)[#link("https://github.com/std-external/deepseeker")[github.com/std-external/deepseeker]]
  #text(size: 9pt, fill: luma(150))[ · v0.1.0 · 下载在 Releases]
]
