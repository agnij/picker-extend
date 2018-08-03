<template>
  <div class="hello">
    <span  class="rootSize">html的根节点元素大小{{rootSize}}</span>
    <input type="text"  v-model="name">
    <div class="container" @click='getRecommend'>渲染推荐类目</div>
    <div class="container" @click="locateChoose">定位之前选中的类目</div>
    <div id='trigger' class="container" style="display:none">类目选择</div>
    <div  class="container" @click="show">选择类目</div>
  </div>
</template>

<script>
import PickerExtend from 'picker-extend'
import {CITY_DATA} from '../data.js'

//  用三个变量标识 上一次的推荐类目，
let recommendItemOne = ''
let recommendItemTwo = ''
let recommendItemThree = ''

// const CITY_DATA = [
//   {
//     cat_name: '山东省',
//     cat_id: '11',
//     // detail: [
//     //   {
//     //     cat_name: '聊城市',
//     //     cat_id: '111'
//     //     // detail: [
//     //     //   {
//     //     //     cat_name: '莘县',
//     //     //     cat_id: '1111'
//     //     //   },
//     //     //   {
//     //     //     cat_name: '阳谷县',
//     //     //     cat_id: '1112'
//     //     //   }
//     //     // ]
//     //   },
//     //   {
//     //     cat_name: '济南市',
//     //     cat_id: '112'
//     //     // detail: [
//     //     //   {
//     //     //     cat_name: '历下区',
//     //     //     cat_id: '1121'
//     //     //   },
//     //     //   {
//     //     //     cat_name: '泉城区',
//     //     //     cat_id: '1122'
//     //     //   }
//     //     // ]
//     //   }
//     // ]
//   },
//   {
//     cat_name: '浙江省',
//     cat_id: '12',
//     // detail: [
//     //   {
//     //     cat_name: '宁波',
//     //     cat_id: '121',
//     //     detail: [
//     //       {cat_name: '北仑区',
//     //         cat_id: '1211' },
//     //       {
//     //         cat_name: '奉化',
//     //         cat_id: '1222'
//     //       }
//     //     ]
//       // },
//       // {
//       //   cat_name: '温州市',
//       //   cat_id: '122',
//       //   detail: [
//       //     {
//       //       cat_name: '文成县',
//       //       cat_id: '1221'
//       //     },
//       //     {
//       //       cat_name: '鹿城区',
//       //       cat_id: '1222'
//       //     }
//       //   ]
//     //   }
//     // ]
//   }
// ]

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      name: ''

    }
  },
  computed: {
    rootSize () {
      return document.documentElement.style.fontSize
    }
  },
  mounted () {
    console.log(this.$root.age
    )
    console.log(CITY_DATA)

    var mobileSelect = this.mobileSelect = new PickerExtend({
      trigger: '#trigger',
      title: '类目选择',
      wheels: [
        {data: CITY_DATA}
      ],
      keyMap: {
        id: 'cat_id',
        value: 'cat_name',
        childs: 'detail',
        recommend: 'recommend'
      },
      //  初始化为000   如果是编辑商品的情况 我们可以通过api去设置
      // position: [0, 0, 0],
      flexibleHeight: '',
      callback: function (indexArr, data) {
        console.log('选择成功之后的回调函数')
        console.log(indexArr)
        console.log(data) // 返回选中的json数据
      }
    })
  },
  methods: {
    show () {
      this.mobileSelect.show()
    },
    locateChoose () {
      this.mobileSelect.locatePosition(0, 1)
      this.mobileSelect.locatePosition(1, 1)
      this.mobileSelect.locatePosition(2, 1)
    },
    handleGoodsName () {
      if (this.name === '牛奶') {
        return ['奶制品', '常温奶', '利乐砖原味常温奶']
      } else if (this.name === '酸奶') {
        return ['休闲食品', '硬糖', '果仁硬糖']
      } else {
        return ['酒', '白酒', '高度白酒']
      }
    },
    getRecommend () {
      //  处理同名的情况  直接结束 减少计算量
      let prevName = window.localStorage.getItem('name')
      if (prevName === this.name) {
        return
      }
      var catArr = this.handleGoodsName()
      // let arr = CITY_DATA.slice(0, 20)
      let arr = Object.assign([], CITY_DATA)
      //  在这里 我们需要知道每一列的类目匹配值的index
      let oneLevelIndex = arr.findIndex((item, index) => {
        return item.cat_name === catArr[0]
      })
      arr[oneLevelIndex].recommend = true
      if (oneLevelIndex === -1) {
        console.log('类目有误，请检查')
        return
      }
      //  清除上一次的选择痕迹
      if (recommendItemOne) {
        recommendItemOne ? recommendItemOne.recommend = false : recommendItemOne = ''
        recommendItemTwo ? recommendItemTwo.recommend = false : recommendItemTwo = ''
        recommendItemThree ? recommendItemThree.recommend = false : recommendItemThree = ''
      }

      let twoLevelIndex = arr[oneLevelIndex].detail.findIndex((item, index) => {
        return item.cat_name === catArr[1]
      })
      arr[oneLevelIndex].detail[twoLevelIndex].recommend = true
      let threeLevelIndex = arr[oneLevelIndex].detail[twoLevelIndex].detail.findIndex((item, index) => {
        return item.cat_name === catArr[2]
      })

      arr[oneLevelIndex].detail[twoLevelIndex].detail[threeLevelIndex].recommend = true
      arr[oneLevelIndex].detail[twoLevelIndex].detail[threeLevelIndex].recommend = true
      console.log('增加推荐字段之后的arr')
      console.log(arr)
      this.mobileSelect.updateWheels(arr)
      recommendItemTwo = arr[oneLevelIndex].detail[twoLevelIndex]
      recommendItemOne = arr[oneLevelIndex]
      recommendItemThree = arr[oneLevelIndex].detail[twoLevelIndex].detail[threeLevelIndex]
      // 类目滚动
      window.localStorage.setItem('name', this.name)
      this.mobileSelect.locatePosition(0, oneLevelIndex)
      this.mobileSelect.locatePosition(1, twoLevelIndex)
      this.mobileSelect.locatePosition(2, threeLevelIndex)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.rootSize{
  width: 1rem;
  height: 1rem;
  border: 1px solid red;
}
.container{

  border: 1px solid;
  margin: 10px;
}

#box{
  width: 300px;
  height: 300px;
  background-color: deepskyblue;
}
</style>
