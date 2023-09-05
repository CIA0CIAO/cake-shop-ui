<template>
  <el-container>
    <el-aside width="50%">
      <el-image style="width: 100%;" :src="good.cover" /></el-aside>
    <el-main>
      <div class="good-item">
        <span class="good-name">{{ good.name }}</span>
        <span class="good-desc">{{ good.desc }}</span>
        <div>
          <span class="good-price">{{ good.price }}&#165;/{{ good.weight }}m^2</span>
        </div>
        <div style="margin-top: 40px;">
          <el-button color="red" type="primary" icon="CirclePlus" @click="addToCart">加入购物车</el-button>
          <el-button color="gray" type="primary" icon="Back" @click="back" plain></el-button>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import server from '@/server.js'
export default {
  data() {
    return {
      user: {
      },
      good: {
        id: undefined
      },
    }
  },
  methods: {
    addToCart() {
      let cart = JSON.parse(localStorage.getItem("cart"))
      if (!cart) {
        cart = {
          goods: []
        }
      }
      let good = cart.goods.find(item => {
        return item.id == this.good.id
      })
      if (!good) {
        good = this.good
        good.num = 0
        this.cart.goods.push(good)
      }
      good.num += 1
      localStorage.setItem("cart", JSON.stringify(cart))
      ElMessage({
        message: '添加成功',
        type: 'success',
      })
    },
    back() {
      this.$router.back()
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      server.getGoodById(to.query.goodId).then(res => {
        vm.good = res.data.good
      }).catch(err => {
        console.log(err)
      })
    })
  }
}
</script>

<style scoped>
.good-item {
  width: 300px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  margin: 10px;
}

.good-item .el-image {
  cursor: pointer;
}

.good-item .good-name {
  font-weight: 600;
  font-size: 32px;
  color: rgba(0, 0, 0, 0.9);
}


.good-item .good-stock,
.good-item .good-add,
.good-item .good-desc {
  font-weight: 400;
  color: rgba(0, 0, 0, 0.5);
}

.good-item .good-price {
  font-weight: 600;
  color: orange;
}
</style>