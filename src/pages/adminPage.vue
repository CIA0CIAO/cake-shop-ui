<template>
    <el-container>
        <el-aside width="auto">
            <div style="margin: 10px;">
                <el-button v-if="!isAsideMenuCollapse" type="primary" icon="Fold" @click="isAsideMenuCollapse = true"/>
                <el-button v-else type="primary" icon="Expand" @click="isAsideMenuCollapse = false"/>
            </div>
            <el-menu ref="asideMenu" :default-active="asideMenuActive" :ellipsis="false"
                     :collapse="isAsideMenuCollapse">
                <el-sub-menu index="个人">
                    <template #title>
                        <el-icon>
                            <UserFilled/>
                        </el-icon>
                        <span>个人</span>
                    </template>
                </el-sub-menu>
                <el-sub-menu index="管理">
                    <template #title>
                        <el-icon>
                            <Management/>
                        </el-icon>
                        <span>管理</span>
                    </template>
                    <el-menu-item index="管理-用户" @click="clickAsideMenuItem">
                        <el-icon>
                            <User/>
                        </el-icon>
                        <template #title>用户</template>
                    </el-menu-item>
                    <el-menu-item index="管理-商品" @click="clickAsideMenuItem">
                        <el-icon>
                            <Dish/>
                        </el-icon>
                        <template #title>商品</template>
                    </el-menu-item>
                    <el-menu-item index="管理-订单" @click="clickAsideMenuItem">
                        <el-icon>
                            <List/>
                        </el-icon>
                        <template #title>订单</template>
                    </el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="设置">
                    <template #title>
                        <el-icon>
                            <Setting/>
                        </el-icon>
                        <span>设置</span>
                    </template>
                </el-sub-menu>
            </el-menu>
        </el-aside>
        <el-main>
            <template v-if="asideMenuActive == '管理-用户'">
                <div class="user-page-wrapper">
                    <div class="user-page">
                        <div v-for="(user, index) in userPageInfo.list" :key="user.id" class="user-page-item">
                            <div class="user-info">
                                <el-avatar :size="40" :src="user.avatar"></el-avatar>
                                <div class="user-nick">{{ user.nick }}</div>
                            </div>
                            <div class="user-operation">
                                <el-switch class="user-lock" v-model="user.locked" active-icon="Lock"
                                           inactive-icon="Unlock"
                                           inline-prompt @click="lockUser(user.id, index)"/>
                            </div>
                        </div>
                    </div>
                </div>
                <el-empty v-if="userPageInfo.total <= 0" :image-size="200" description="暂无用户"/>
                <el-pagination small background layout="prev, pager, next, jumper, ->" :total="userPageInfo.total"
                               v-model:current-page="userPageInfo.pageNum"
                               :hide-on-single-page="hideUserPagination"></el-pagination>
            </template>
            <template v-if="asideMenuActive == '管理-商品'">
                <div class="good-operation">
                    <el-button type="success" icon="CirclePlus" circle @click="beforeShowGoodForm('添加商品')"/>
                    <el-button type="danger" icon="Delete" circle @click="removeGood"/>
                </div>
                <div class="good-page-wrapper">
                    <div class="good-page">
                        <div v-for="(good, index) in goodPageInfo.list" :key="good.id" class="good-page-item"
                             @dblclick="beforeShowGoodForm('编辑商品')"
                             :class="{ 'good-item-active': activeGoodItemIndex == index }"
                             @click="activeGoodItemIndex = index">
                            <div class="good-info-left">
                                <el-avatar :size="40" :src="good.cover"></el-avatar>
                                <div class="good-name">{{ good.name }}</div>
                            </div>
                            <div class="good-info-right">
                                <div>{{ good.stock }}份</div>
                            </div>
                        </div>
                    </div>
                </div>
                <el-empty v-if="goodPageInfo.total <= 0" :image-size="200" description="暂无商品"/>
                <el-pagination small background layout="prev, pager, next, jumper, ->" :total="goodPageInfo.total"
                               v-model:current-page="goodPageInfo.pageNum"
                               :hide-on-single-page="hideGoodPagination"></el-pagination>
            </template>
            <template v-if="asideMenuActive == '管理-订单'">
                <div class="order-container" v-for="(order) in orders" :key="order.id">
                    <div class="order-item">
                        <div class="good-container">
                            <div class="good-item" v-for="good in order.goods" :key="good.id">
                                <el-image style="width: 100px;" :src="good.cover"/>
                                <span class="good-info">{{ good.name }} x {{ good.num }}</span>
                            </div>
                        </div>
                        <div class="order-info">
                            <div class="order-total">{{ order.total }}￥</div>
                            <div class="order-create_time">{{ order.createTime }}</div>
                            <div class="order-status">{{ order.status }}</div>
                        </div>
                    </div>
                </div>
            </template>
        </el-main>
    </el-container>
    <el-dialog v-model="showGoodForm" :title="goodFormScene" width="300px">
        <el-form class="goodForm" :model="goodForm">
            <el-form-item>
                <el-input v-model="goodForm.name" type="text" prefix-icon="Burger" placeholder="商品名称"/>
            </el-form-item>
            <el-form-item>
                <el-input v-model="goodForm.category" type="text" prefix-icon="Dish" placeholder="类别"/>
            </el-form-item>
            <el-form-item>
                <el-input v-model="goodForm.desc" type="textarea" placeholder="商品描述" :rows="3"/>
            </el-form-item>
            <el-form-item label="单价">
                <el-input-number v-model="goodForm.price" :min="0.01" :max="999.00" size="small" :precision="2"/>
                <span style="margin: 0px 5px;">&#165;\份</span>
            </el-form-item>
            <el-form-item label="重量">
                <el-input-number v-model="goodForm.weight" :min="0.01" :max="999.00" size="small" :precision="2"/>
                <span style="margin: 0px 5px;">g\份</span>
            </el-form-item>
            <el-form-item label="库存">
                <el-input-number v-model="goodForm.stock" :min="0" size="small"/>
                <span style="margin: 0px 5px;">份</span>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button v-if="goodFormScene == '添加商品'" type="primary" @click="addGood">
                添加
            </el-button>
            <el-button v-else-if="goodFormScene == '编辑商品'" type="primary" @click="updateGood">
                保存
            </el-button>
        </template>
    </el-dialog>
</template>

<script>
import server from '@/server.js'

export default {
    data() {
        return {
            asideMenuActive: "管理-商品",
            isAsideMenuCollapse: false,
            userPageInfo: {
                startRow: 0,
                endRow: 0,
                pageNum: 1,
                pageSize: 8,
                size: 8,
                total: 0,
                pages: 1,
                prePage: 0,
                nextPage: 0,
                isFirstPage: false,
                isLastPage: false,
                hasPreviousPage: true,
                hasNextPage: true,
                navigatePages: 0,
                navigatePageNums: [],
                list: []
            },
            goodPageInfo: {
                startRow: 0,
                endRow: 0,
                pageNum: 1,
                pageSize: 8,
                size: 8,
                total: 0,
                pages: 1,
                prePage: 0,
                nextPage: 0,
                isFirstPage: false,
                isLastPage: false,
                hasPreviousPage: true,
                hasNextPage: true,
                navigatePages: 0,
                navigatePageNums: [],
                list: []
            },
            goodCategorys: [],
            goodOrders: [],
            activeName: "user",
            goodForm: {
                name: "",
                price: 0.00,
                desc: "",
                stock: 0,
                weight: 100.00,
                category: ""
            },
            showGoodForm: false,
            goodFormScene: '添加商品',
            activeGoodItemIndex: -1,
            orders: [],
        }
    },
    computed: {
        hideUserPagination() {
            return this.userPageInfo.pages <= 1
        },
        hideGoodPagination() {
            return this.goodPageInfo.pages <= 1
        }
    },
    watch: {
        'userPageInfo.pageNum': {
            handler(pageNum) {
                this.getUserPage(pageNum)
            },
            immediate: true
        },
        'goodPageInfo.pageNum': {
            handler(pageNum) {
                this.getGoodPage(pageNum)
            },
            immediate: true
        }
    },
    methods: {
        getUserPage(pageNum = 1, pageSize = 8) {
            server.getUsersByAdmin(pageNum, pageSize).then(res => {
                let userPageInfo = res.data.userPageInfo
                this.userPageInfo.startRow = userPageInfo.startRow
                this.userPageInfo.endRow = userPageInfo.endRow
                this.userPageInfo.pageSize = userPageInfo.pageSize
                this.userPageInfo.size = userPageInfo.size
                this.userPageInfo.total = userPageInfo.total
                this.userPageInfo.pages = userPageInfo.pages
                this.userPageInfo.prePage = userPageInfo.prePage
                this.userPageInfo.isFirstPage = userPageInfo.isFirstPage
                this.userPageInfo.isLastPage = userPageInfo.isLastPage
                this.userPageInfo.hasPreviousPage = userPageInfo.hasPreviousPage
                this.userPageInfo.hasNextPage = userPageInfo.hasNextPage
                this.userPageInfo.navigatePages = userPageInfo.navigatePages
                this.userPageInfo.navigatePageNums = userPageInfo.navigatePageNums
                this.userPageInfo.list = userPageInfo.list
            }).catch(err => {
                console.log(err)
            }).finally(() => {
            })
        },
        clickAsideMenuItem(menuItem) {
            this.asideMenuActive = menuItem.index
        },
        lockUser(userId, index) {
            let locked = this.userPageInfo.list[index].locked
            server.lockUser(userId, locked).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
        },
        getGoodPage(pageNum = 1, pageSize = 12) {
            server.getGoods(pageNum, pageSize).then(res => {
                let goodPageInfo = res.data.goodPageInfo
                this.goodPageInfo.startRow = goodPageInfo.startRow
                this.goodPageInfo.endRow = goodPageInfo.endRow
                this.goodPageInfo.pageSize = goodPageInfo.pageSize
                this.goodPageInfo.size = goodPageInfo.size
                this.goodPageInfo.total = goodPageInfo.total
                this.goodPageInfo.pages = goodPageInfo.pages
                this.goodPageInfo.prePage = goodPageInfo.prePage
                this.goodPageInfo.isFirstPage = goodPageInfo.isFirstPage
                this.goodPageInfo.isLastPage = goodPageInfo.isLastPage
                this.goodPageInfo.hasPreviousPage = goodPageInfo.hasPreviousPage
                this.goodPageInfo.hasNextPage = goodPageInfo.hasNextPage
                this.goodPageInfo.navigatePages = goodPageInfo.navigatePages
                this.goodPageInfo.navigatePageNums = goodPageInfo.navigatePageNums
                this.goodPageInfo.list = goodPageInfo.list
            }).catch(err => {
                console.log(err)
            }).finally(() => {
            })
        },
        addGood() {
            server.addGood(this.goodForm).then(res => {
                if (res.data.code != 200) throw ""
                ElMessage({
                    message: '添加成功',
                    type: 'success',
                })
                this.getGoodPage(this.goodPageInfo.pageNum)
                this.showGoodForm = false
            }).catch(err => {
                ElMessage({
                    message: '添加失败' + err,
                    type: 'error',
                })
                console.log(err)
            })
        },
        removeGood() {
            if (this.activeGoodItemIndex < 0) return
            let goodId = this.goodPageInfo.list[this.activeGoodItemIndex].id
            server.removeGood(goodId).then(res => {
                if (res.data.code != 200) throw ""
                ElMessage({
                    message: '删除成功',
                    type: 'success',
                })
                this.getGoodPage(this.goodPageInfo.pageNum)
            }).catch(err => {
                ElMessage({
                    message: '删除失败' + err,
                    type: 'error',
                })
                console.log(err)
            })
        },
        updateGood() {
            let good = {
                id: this.goodPageInfo.list[this.activeGoodItemIndex].id
            }
            Object.assign(good, this.goodForm)
            server.updateGood(good).then(res => {
                if (res.data.code != 200) throw ""
                ElMessage({
                    message: '编辑成功',
                    type: 'success',
                })
                this.getGoodPage(this.goodPageInfo.pageNum)
                this.showGoodForm = false
            }).catch(err => {
                ElMessage({
                    message: '编辑失败' + err,
                    type: 'error',
                })
                console.log(err)
            })
        },
        beforeShowGoodForm(scene) {
            this.goodFormScene = scene
            if (scene == '添加商品') {
                this.goodForm = {
                    name: "",
                    price: 0.00,
                    desc: "",
                    stock: 0,
                    weight: 100.00
                }
            } else if (scene == '编辑商品') {
                let good = this.goodPageInfo.list[this.activeGoodItemIndex]
                this.goodForm.name = good.name
                this.goodForm.price = good.price
                this.goodForm.desc = good.desc
                this.goodForm.stock = good.stock
                this.goodForm.weight = good.weight
                this.goodForm.category = good.category
            }
            this.showGoodForm = true
        }
    },
    beforeRouteEnter: (to, from, next) => {
        if (localStorage.getItem("token") == null) return
        next(vm => {
            server.getOrdersByAdmin().then(res => {
                res.data.orders.forEach(order => {
                    order.goods = JSON.parse(order.goods)
                    order.createTime = new Date(order.createTime).toLocaleString()
                });
                vm.orders = res.data.orders
            })
        })
    },
}
</script>

<style scoped>
.user {
    display: flex;
    align-items: center;
    padding: 10px;
}

.user .nick {
    font-weight: 600;
    margin: 0px 5px;

}

.addGoodForm {
    width: 600px;
    padding: 10px;
    background: silver;
}


.user-page-wrapper .user-page {
    display: flex;
    flex-wrap: wrap;
}

.user-page-wrapper .user-page-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: calc(50% - 10px);
    height: 60px;
    background: #edffec;
    margin: 5px;
    padding: 10px;
    border-radius: 10px;
    color: var(--el-color-primary);
    cursor: pointer;
}

.user-page-item .user-info {
    display: flex;
    align-items: center;
}

.user-page-item .user-nick {
    margin: 5px;
}

.user-page-wrapper + .el-pagination {
    justify-content: center;
    margin: 5px 0px;
}

.el-main .good-operation {
    display: flex;
    align-items: center;
    justify-content: end;
    margin: 10px 0px;
    padding: 0px 15px;
}

.good-page-wrapper .good-page {
    display: flex;
    flex-wrap: wrap;
}

.good-page-wrapper .good-page-item.good-item-active {
    background-color: var(--el-color-primary-light-9);
}

.good-page-wrapper .good-page-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: calc(33.33% - 10px);
    height: 60px;
    background: #edffec;
    margin: 5px;
    padding: 10px;
    border-radius: 10px;
    color: var(--el-color-primary);
    cursor: pointer;
}

.good-page-item .good-info-left {
    display: flex;
    align-items: center;
}

.good-page-item .good-info-right {
    display: flex;
    align-items: center;
}

.good-page-wrapper + .el-pagination {
    justify-content: center;
    margin: 5px 0px;
}

.good-page-item .good-name {
    margin: 5px;
}

.order-container {
    display: flex;
    flex-direction: column;
}

.order-container .order-item {
    display: flex;
    align-items: flex-end;
}

.order-container .order-item:hover {
    background: rgb(247, 244, 240);
}

.order-container .good-container {
    display: flex;
}

.order-container .good-item {
    display: flex;
    flex-direction: column;
    margin: 5px;
}

.order-container .good-item .good-info {
    font-size: 12px;
}

.order-container .order-info {
    font-size: 12px;
}
</style>