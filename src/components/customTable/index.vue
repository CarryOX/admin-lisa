<template>
    <div>
        <div class="tips">
            <div>
                <i class="el-icon-info" style="margin-right: 5px;"></i>
                <span>可自由拖动表头边框线控制单列宽度</span>
            </div>
        </div>
        <el-table id="out-table" :data="data" stripe border v-loading="'loading' in config ? config.loading : isLoading"
                  element-loading-text="给我一点时间" :header-cell-style="{background: '#EBEEF5'}">

            <el-table-column align='center' :label="item.key" :prop="item.value" :width="item.columnWidth"
                             v-for='(item, index) in classList || config.classList' :key='index'>
                <template slot-scope="scope">

<!--                    <img class='thumb_img' :src='scope.row[item.value]' v-if='item.isImg'/>-->
                    <el-image v-if='item.isImg' class='thumb_img' :src='scope.row[item.value]' :preview-src-list="[scope.row[item.value]]">
                        <div slot="error" class="image-slot">
                            <span>/</span>
                        </div>
                    </el-image>
                    <el-image class='isAvatar' :src='scope.row[item.value]' :preview-src-list="[scope.row[item.value]]" v-else-if='item.isAvatar && scope.row[item.value]'>
                        <div slot="error" class="image-slot">
                            <span>/</span>
                        </div>
                    </el-image>
                    <img class='isAvatar' src='@/assets/defaultHead.jpg' v-else-if='item.isAvatar'/>
                    <!-- 展示多个图片 -->
                    <div class="imgList" v-else-if="item.isImgList">
                        <img v-for="(dataImg,index) in scope.row[item.value]" :src='dataImg'/>
                    </div>

                    <video class="videos" controls="controls" v-else-if='item.isVideo'
                           :src="scope.row[item.value]"></video>

                    <div v-else-if='item.isIcon'>
                        <i class='el-icon-check' v-if='scope.row[item.value]'></i>
                        <i class='el-icon-close' v-else></i>
                    </div>

                    <el-rate disabled v-model='scope.row[item.value]' v-else-if='item.isRate'></el-rate>

                    <el-popover trigger="hover" placement="top" v-else-if='item.isMulti'>
                        <div v-for='(item, index) in scope.row[item.value]' :key='index'>
                            <p>{{ item }}</p>
                        </div>
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ scope.row[item.value][0] }}</el-tag>
                        </div>
                    </el-popover>

                    <div v-else-if="item.warp_item">
                        <div v-for="(items,indexs) in scope.row[item.value]" :key="indexs">{{ items }}</div>
                    </div>

                    <div v-else-if="item.overflowShow">
                        <div style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
                            {{ scope.row[item.value] }}
                        </div>
                    </div>
                    <div v-else-if="item.textType">
                      <div v-for="(items,indexs) in scope.row[item.value]" v-html="items" :key="indexs" style="text-align: center"></div>
                    </div>
                    <div v-else-if="item.progress">
                      <el-progress :text-inside="true" :stroke-width="26" :percentage="70"></el-progress>
                    </div>
                    <div v-else :style="{color: scope.row[item.value]? scope.row[item.value + '_color'] : ''}">{{ scope.row[item.value] }}</div>

                </template>
            </el-table-column>

            <el-table-column label="操作" v-if='config.showOperate' fixed="right" align='center'>
                <template slot-scope="scope">

                    <el-button size="mini" type="primary" @click="showDetail(scope.$index, scope.row)"
                               v-if='config.showDetail || config.detailTitle'>{{ config.detailTitle || '详情' }}
                    </el-button>

                    <el-button size="mini" type="primary" @click="showUpdate(scope.$index, scope.row)"
                               v-if='config.updateTitle' v-text='config.updateTitle'></el-button>

                    <el-button size="mini" type="primary" @click="showLook(scope.$index, scope.row)"
                               v-if='config.lookTitle' v-text='config.lookTitle'></el-button>

                    <el-button class='mr5' size='mini' :type="item.type || 'primary'"
                               @click="show(scope.$index, scope.row, index, item)"
                               v-for='(item, index) in config.btnList' :disabled="isShowSpecial(scope.row, item.key)"
                               v-if='"status" in item ? scope.row[item.key] === item.status : true'
                    >{{ item.value || item.title || item.name }}
                    </el-button>
                    <!--          v-if='(!scope.row.refundState)&&("status" in item ? scope.row[item.key] === item.status : scope.row[item.key])'-->
                    <!-- auth status -->
                    <el-button size="mini" type="success" @click="showAuth(scope.$index, scope.row, 1)"
                               v-if='config.showAuth && scope.row.state == 0'>同意
                    </el-button>
                    <el-button size="mini" type="warning" @click="showAuth(scope.$index, scope.row, 2)"
                               v-if='config.showAuth && scope.row.state == 0'>拒绝
                    </el-button>

                    <el-button size="mini" type="primary" @click="showCustom(scope.$index, scope.row)"
                               v-if="config.custom && typeof config.custom === 'string'"
                               v-text='config.custom'></el-button>

                    <el-button size="mini" type="primary" @click="showFinish(scope.$index, scope.row)"
                               v-if="config.showFinish &&scope.row[config.showFinish[0]]"
                               v-text='config.showFinish[1]'></el-button>

                    <el-button size="mini" type="warning" @click="showJudge(scope.$index, scope.row)"
                               v-if="config.judge"
                               v-text='scope.row[config.judge[0]] ? config.judge[1] : config.judge[2]'></el-button>

                    <el-button size="mini" type="primary" @click="showSelect(scope.$index, scope.row)"
                               v-if='config.showSelect'>{{ config.selectTitle }}
                    </el-button>
                    <el-button size="mini" type="danger" @click="showDeleteDialog(scope.$index, scope.row, index, item)"
                               v-if='config.showDelete'>删除
                    </el-button>

                    <el-popover
                        v-if="config.popoverList"
                        placement="bottom"
                        @show="initPopover(scope.row)"
                        trigger="click">
                        <el-button
                            style="display: block; width: 100%; margin-top: 5px"
                            size="mini"
                            :type="item.type? item.type : 'primary'"
                            plain
                            v-for='(item, index) in config.popoverList'
                            :key='index'
                            v-if="'status' in item? scope.row[item.key] === item.status  : true "
                            @click="showPopover(scope.$index, scope.row, item.value, item.key)"
                        >{{ item.value || '详情' }}
                        </el-button>

                        <el-button slot="reference" class="handel-btn">操作</el-button>
                    </el-popover>
                </template>
            </el-table-column>

        </el-table>

        <div>
            <el-pagination ref='pagination'
                           background :page-sizes="[10, 20, 30, 50]"
                           :current-page="query.page"
                           :page-size="query.limit"
                           :total="total"
                           v-if="showPagination"
                           class="showPagination"
                           @size-change="changeSize"
                           @current-change="changePage"
                           layout="total, sizes, prev, pager, next">
            </el-pagination>
        </div>

    </div>
</template>

<script>
export default {
    name: 'customTable',
    props: {
        config: {
            type: Object,
            default: function () {
                return {
                    // {String|Array} custom 1. [judge conditional, TrueText, FalseText]
                }
            }
        },
        data: {
            type: Array,
        },
        classList: {
            type: Array,
        },
        isLoading: {
            type: Boolean,
        },
        total: {
            type: Number,
        },
        showPagination: {
            type: Boolean,
            default: true
        },
    },

    data() {
        return {
            query: {
                limit: 10,
                page: 1,
                keyWord: '',
            },
            confirmOpt: {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            },
        }
    },
    computed: {
        isShowSpecial() {
            return function (row, key) {
                if(row.outline || row.partCheck) {
                    if((row.pay_info_state == 2 || row.pay_info_state == 3) && (key == "agree" || key == "reject")) {
                        return true
                    }
                }else{
                    if((row.audit_state == 2 || row.audit_state == 3) && (key == "agree" || key == "reject")) {
                        return true
                    }
                }
            }
        }
    },
    watch: {
        config: function (val, ol) {
            this.config = val
            console.log(val, "comfig", ol)
        },
    },

    methods: {
        show(i, row, index, item) {
            if (['danger', 'warning'].indexOf(item.type) != -1 || item.isConfirm) {
                return this.$confirm(item.confirmText ? item.confirmText : '确认继续操作吗?', '', this.confirmOpt).then(() => this.$emit('modify', row, index, i, item));
            }
            this.$emit('modify', row, index, i, item);
        },
        showDetail(index, row) {
            this.$emit('show', row, index);
        },
        showUpdate(index, row) {
            this.$emit('update', row);
        },
        showLook(index, row) {
            this.$emit('look', row);
        },
        showAuth(index, row, state) {
            this.$emit('auth', row, state)
        },
        showCustom(index, row) {
            this.$emit('custom', row, 'custom')
        },
        showJudge(index, row) {
            this.$emit('judge', row)
        },
        showDeleteDialog(index, row) {
            let config = {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
            this.$confirm(`此操作将删除该条目, 是否继续?`, '提示', config).then(() => this.$emit('delete', row, index)).catch(e => this.$notify.info({message: '已取消'}))
        },
        showFinish(index, row) {
            let config = {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
            this.$confirm(`确认操作, 是否继续?`, '提示', config).then(() => this.$emit('finish', row)).catch(e => this.$notify.info({message: '已取消'}))
        },

        showAuthUpdate(index, row) {
            this.$emit('authUpdate', 'update', row);
        },
        showAuthShow(index, row) {
            this.$emit('authShow', 'show', row);
        },
        showSelect(index, row) {
            this.$emit('select', row);
        },
        showCome(index, row) {
            this.$emit('uncome', row);
        },
        showPopover(index, row, value, key) {
            this.$emit('handlePopover', row, value, key);
        },
        initPopover(row) {
            this.$emit('initPopover', row);
        },

        changeState(index, row) {
            this.$emit('changeState', row);
        },
        changeSize(val) {
            this.query.limit = val;
            this.query.page = 1;
            this.$emit('change', this.query);
        },
        changePage(val) {
            this.query.page = val;
            this.$emit('change', this.query);
        },
        init() {
            this.query.page = 1;
            this.query.keyWord = '';
            // reset pagination when dynamic change current-page property value
            this.$refs.pagination.lastEmittedPage = 1;
        },
        // call for parent Component
        initPage() {
            this.query.page = 1;
        },
    }
}

</script>

<style scoped>
.el-button {
    display: block;
    margin: 0 auto;
    margin-top: 5px;
}

.thumb_img {
    width: 100px;
    height: 100px;
}

.isAvatar {
    width: 66px;
    height: 66px;
    border-radius: 50%;
}

.videos {
    width: 100px;
    height: 100px
}

.showPagination {
    width: 300px;
    margin: 30px auto;
    overflow: visible;
}

.imgList img {
    width: 50px;
    height: 50px;
    margin-right: 10px
}

.imgList {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    width: 180px
}

.tips {
    display: flex;
    justify-content: flex-end;
    margin: 10px 20px;
    font-size: 12px;
    color: #999;
}
</style>
