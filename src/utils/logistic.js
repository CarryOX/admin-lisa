import {
  getExpressage_api
} from "@/api/common"
// import {
//   uniq
// } from "shelljs";
export default {

  data() {
    return {
      logisticList: [
        // { id: 'SF', name: '顺丰速运' },
        // { id: 'HTKY', name: '百世快递' },
        // { id: 'ZTO', name: '中通快递' },
        // { id: 'STO', name: '申通快递' },
        // { id: 'YTO', name: '圆通快递' },
        // { id: 'YD', name: '韵达速递' },
        // { id: 'YZPY', name: '邮政快递包裹' },
        // { id: 'EMS', name: 'EMS' },
        // { id: 'HHTT', name: '天天快递' },
        // { id: 'UC', name: '优速快递' },
        // { id: 'DBL', name: '德邦快递' },
        // { id: 'ZJS', name: '宅急送' },
      ],
    };
  },

  created() {
    // var data ={
    //   LogisticCode:""
    // }
    // getExpressage_api(data).then(res=>{
    //   if(res.sstatus==0){
    //     res.data.forEach((element,index) => {
    //       this.logisticList.push({id:index,name:element.LogisticCode})
    //     });
    //     this.logisticList = res.data;
    //     this.postName.categories = this.logisticList;
    //   }else{
    //     this.$message.error(res.error)
    //   }

    // })


  },
  methods: {
    getData() {
      this.post_data.postName.categories = [];
      var data = {
        LogisticCode: this.post_data.post.value
      }
      console.log(data, "data")
      getExpressage_api(data).then(res => {
        if (res.code == 0) {
          res.data.Shippers.forEach((element, index) => {
            this.post_data.postName.categories.push({
              id: element.ShipperCode,
              name: element.ShipperName
            })
          });
          // console.log(this.postName.categories.this.postName.categories[0].ShipperCode)
          this.post_data.postName.value = this.post_data.postName.categories[0].id;
          this.$forceUpdate()
          if (res.data.Shippers.length == 0) {
            this.$message.error("快递单号不存在")
          }
        } else {
          this.$message.error("快递单号不存在")
        }

      })
    },
  }

}
