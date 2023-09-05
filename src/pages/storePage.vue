<template>
  <el-container>
    <el-main>
      <div style="display: flex; justify-content: space-between; align-items: center; margin: 10px 0px;">
        <el-input style="width: 300px;" v-model="goodConstraints.keyword" :placeholder="searchPlaceholder">
          <template #append>
            <el-button icon="Search" @click="searchGood" />
          </template>
        </el-input>
        <el-dropdown :hide-on-click="false">
          <el-icon :size="30">
            <ShoppingCart />
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="good in cart.goods" :key="good.id">
                <div class="cart-item">
                  <el-image style="width: 100px;" :src="good.cover" />
                  <div class="cart-item-info">
                    <span class="good-name">{{ good.name }}</span>
                    <span class="good-price">{{ good.price }}&#165;/{{ good.weight }}m^2</span>
                    <span>
                      <el-input-number style="width: 80px;" v-model="good.num" :min="0" :max="20" size="small"
                        :step-strictly="true" @change="cartGoodNumChange(good)" />&nbsp;份
                    </span>
                  </div>
                </div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div class="cart-footer">
                  <span>总价：{{ cartTotal }}&#165;</span>
                  <el-button color="red" @click="pay">支付</el-button>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center;margin: 10px 0px;">
        <el-radio-group style="margin: 5px 0px;" v-model="goodConstraints.category" size="small">
          <el-radio-button label="全部" />
          <el-radio-button label="中国" />
          <el-radio-button label="日本" />
          <el-radio-button label="美国" />
          <el-radio-button label="澳大利亚" />
          <el-radio-button label="俄罗斯" />
          <el-radio-button label="英国" />
        </el-radio-group>
        <div style="margin: 5px 0px;font-size: 12px;">
          价格：<el-input-number v-model="goodConstraints.minPrice" :min="5000.00" :max="10000.00" size="small" :step="100"
            :precision="1" />
          <el-input-number v-model="goodConstraints.maxPrice" :min="5000.00" :max="10000.00" size="small" :precision="1"
            :step="100" />&nbsp;￥
        </div>
      </div>
      <div class="good-container">
        <div class="good-item" v-for="(good, index) in goods" :key="good.id">
          <el-image style="width: 100%;" :src="good.cover" @click="toGoodPage(good.id)" />
          <span class="good-name">{{ good.name }}</span>
          <span class="good-desc">{{ good.desc }}</span>
          <div>
            <span class="good-price">{{ good.price }}&#165;/{{ good.weight }}m^2</span>
          </div>
          <div class="good-add" @click="addToCart(index)">
            <el-icon :size="16">
              <CirclePlus />
            </el-icon>加入购物车
          </div>
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
      goods: [],
      searchValue: "",
      searchPlaceholder: "关键字",
      cart: {
        goods: []
      },
      goodConstraints: {
        keyword: '',
        category: '全部',
        minPrice: 5000.0,
        maxPrice: 10000.0
      }
    }
  },
  computed: {
    cartTotal() {
      return this.cart.goods.reduce((total, good) => {
        return total + good.price * good.num
      }, 0.00)
    }
  },
  watch: {
    cart: {
      handler(newValue, oldValue) {
        localStorage.setItem("cart", JSON.stringify(newValue))
      },
      deep: true
    },
    goodConstraints: {
      handler(newValue, oldValue) {
        this.searchGood()
      },
      deep: true
    }
  },
  methods: {
    searchGood() {
      let constraints = {}
      constraints.keyword = this.goodConstraints.keyword,
        constraints.category = this.goodConstraints.category == '全部' ? '' : this.goodConstraints.category
      constraints.minPrice = this.goodConstraints.minPrice
      constraints.maxPrice = this.goodConstraints.maxPrice
      server.searchGood(constraints).then(res => {
        this.goods = res.data.goods
      }).catch(err => log)
    },
    toGoodPage(goodId) {
      this.$router.push({
        path: '/good',
        query: {
          goodId,
        }
      })
    },
    addToCart(goodIndex) {
      let newGood = this.goods[goodIndex]
      let good = this.cart.goods.find(item => {
        return item.id == newGood.id
      })
      if (good == null) {
        good = newGood
        good.num = 0
        this.cart.goods.push(good)
      }
      good.num += 1
    },
    cartGoodNumChange(good) {
      if (good.num <= 0) {
        let index = this.cart.goods.findIndex(item => {
          return item.id == good.id
        })
        this.cart.goods.splice(index, 1)
      }
    },
    pay() {
      server.getUser().then(res => {
        let order = {
          goods: JSON.stringify(this.cart.goods),
          total: this.cartTotal,
          receiverId: res.data.user.id,
        }
        return server.addOrder(order)
      }).then(res => {
        if (res.data.code != 200) throw ""
        ElMessage({
          message: '支付成功',
          type: 'success',
        })
        console.log(res)
      }).catch(err => {
        ElMessage({
          message: '支付失败',
          type: 'error',
        })
        console.log(err)
      })
    }
  },
  created() {
    server.getGoods(1, 12).then(res => {
      this.goods = res.data.goodPageInfo.list
    })
    let cart = localStorage.getItem("cart")
    if (cart != null) {
      this.cart = JSON.parse(cart)
    }
  }
}
</script>

<style scoped>
.good-container {
  display: flex;
  flex-wrap: wrap;
  height: 600px;
  overflow: auto;
}

.good-item {
  width: calc(25% - 20px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  margin: 10px;
}

.good-item .el-image {
  cursor: pointer;
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
  cursor: pointer;
}

.cart-item {
  width: 200px;
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-item-info {
  width: 100px;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.cart-footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>