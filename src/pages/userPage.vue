<template>
  <el-container>
    <el-main>
      <div class="order-container" v-for="(order, index) in orders" :key="order.id">
        <div class="order-item">
          <div class="good-container">
            <div class="good-item" v-for="good in order.goods" :key="good.id">
              <el-image style="width: 100px;" :src="good.cover" />
              <span class="good-info">{{ good.name }} x {{ good.num }}</span>
            </div>
          </div>
          <div class="order-info">
            <div class="order-total">{{ order.total }}￥</div>
            <div class="order-create_time">{{ order.createTime }}</div>
            <el-button color="red" type="primary" icon="Delete" @click="removeOrder(order.id)"
              size="small">撤销</el-button>
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
      user: {
      },
      orders: [],
    }
  },
  methods: {
    removeOrder(orderId) {
      server.removeOrder(orderId).then(res => {
        this.updateOrder()
        ElMessage({
          message: '撤销成功',
          type: 'success',
        })
      }).catch(err => {
        console.log(err)
      })
    },
    updateOrder() {
      server.getOrdersByUser().then(res => {
        res.data.orders.forEach(order => {
          order.goods = JSON.parse(order.goods)
          order.createTime = new Date(order.createTime).toLocaleString()
        });
        this.orders = res.data.orders
      })
    }
  },
  beforeRouteEnter: (to, from, next) => {
    let token = localStorage.getItem('token')
    if (token != null) {
      next(vm => {
        server.getUser(token).then(res => {
          vm.user = res.data.user
        })
        vm.updateOrder()
      })
    }
  }
}
</script>

<style>
.user {
  display: flex;
  align-items: center;
  padding: 10px;
}

.user .nick {
  font-weight: 600;
  margin: 0px 5px;

}

.user-role {
  font-weight: 400;
  font-size: 0.6em;
  margin: 0px 5px;
}

.order-container {
  display: flex;
  flex-direction: column;
}

.order-item {
  display: flex;
  align-items: flex-end;
}

.order-item:hover {
  background: rgb(247, 244, 240);
}

.good-container {
  display: flex;
}

.good-item {
  display: flex;
  flex-direction: column;
  margin: 5px;
}

.good-item .good-info {
  font-size: 12px;
}

.order-info {
  font-size: 12px;
}
</style>