<template>
  <v-carousel v-model="model">
    <v-carousel-item>
      <div class="pa-4">
        <h2 style="background-color:orange;" class="pa-2">概要</h2>
        <v-sheet height="100%" tile class="ma-2">
          <ol>
            <li>
              レジャー中「みんなで合計xxx円」という支払いは割り勘しない
            </li>
            <li>
              代わりに各人の支払額をメモ（支払額が少ない人が払うとなおよし）
            </li>
            <li>
              レジャーの終わりに最終的な差額でお金のやりとりをする
            </li>
            <li>
              トータル割り勘成立！
            </li>
          </ol>
        </v-sheet>
      </div>
    </v-carousel-item>
    <v-carousel-item style="justify-content:center">
      <h2 style="background-color:orange;" class="pa-2">
        1. 割勘するメンバーを追加
      </h2>
      <p style="text-align:center" class="ma-2">
        <img src="./../assets/helpAppendUser.png" width="100%" />
      </p>
    </v-carousel-item>
    <v-carousel-item style="justify-content:center">
      <h2 style="background-color:orange;" class="pa-2">
        2. 各メンバーの支払い額を記録
      </h2>
      <p style="text-align:center" class="ma-2">
        <img src="./../assets/helpPayment.png" width="100%" />
      </p>
    </v-carousel-item>
    <v-carousel-item style="justify-content:center">
      <h2 style="background-color:orange;" class="pa-2">
        3. 表示される額の受け渡しで割勘！
      </h2>
      <p style="text-align:center" class="ma-2">
        <img src="./../assets/helpRepayment.png" width="100%" />
      </p>
    </v-carousel-item>
  </v-carousel>
</template>

<script>
export default {
  name: "helpCarousel",
  data: () => ({
    model: 0,
    colors: ["primary", "secondary", "yellow darken-2", "red", "orange"],
  }),
};
</script>
