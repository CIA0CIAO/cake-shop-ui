<template>
  <el-main>
    <el-carousel height="350px" :interval="4000">
      <el-carousel-item v-for="item in 2" :key="item">
        <el-image style="width: 100%; height: 100%"
          :src="`http://localhost:10001/images/ui/big-house.jpg`" />
      </el-carousel-item>
    </el-carousel>
    <div class="good-container">
      <div class="good-item" v-for="good in goods" :key="good.id" @click="toGoodPage(goodId)">
        <el-image style="width: 100%;" :src="good.cover" />
        <span class="good-name">{{ good.name }}</span>
        <span class="good-desc">{{ good.desc }}</span>
        <div>
          <span class="good-price">{{ good.price }}￥/{{ good.weight }}m^2</span>
        </div>
      </div>
    </div>
  </el-main>
</template>

<script>
import server from '@/server.js'
export default {
  data() {
    return {
      menuActive: "首页",
      goods: [],
    }
  },
  methods: {
    toGoodPage(goodId) {
      this.$router.push({
        path: '/good',
        query: {
          goodId,
        }
      })
    },
  },
  created() {
    server.getGoods(1, 8).then(res => {
      this.goods = res.data.goodPageInfo.list
    })
  }
}
</script>

<style scoped>
.good-container {
  display: flex;
  flex-wrap: wrap;
}

.good-item {
  width: calc(25% - 20px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  margin: 10px;
}

.good-name {
  font-weight: 600;
  color: rgba(0, 0, 0, 0.9);
}


.good-stock,
.good-add,
.good-desc {
  font-weight: 400;
  font-size: 0.5em;
  color: rgba(0, 0, 0, 0.5);
}

.good-price {
  font-weight: 600;
  font-size: 0.5em;
  color: orange;
}

.good-add {
  display: flex;
  align-items: center;
  color: #ff3500;
}

.el-carousel {
  padding: 10px;
}
</style>