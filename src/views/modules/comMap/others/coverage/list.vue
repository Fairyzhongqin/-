<template>
  <div class="map-coverage-list-container">
    <!-- 在岗在位专题 -->
    <div class="content">
      <div class="content-title"
           @click="checkboxShow=!checkboxShow">
        <span>
          <!--<IconSvg v-if="!checkboxShow"-->
          <!--name="iconjiahao"></IconSvg>-->
          <!--<IconSvg v-else-->
          <!--name="iconjianhao03"></IconSvg>-->
          <i v-if="!checkboxShow"
             class="el-icon-plus"></i>
          <i v-else
             class="el-icon-minus"></i>
          <icon-svg name="wenjianjia"
                    class="content-title-icon"></icon-svg>
          在岗在位专题
        </span>

      </div>
      <!-- checkbox动画 -->
      <transition name='checkboxTopOne'>
        <div class="content-checkBox"
             v-if="checkboxShow">
          <el-checkbox-group v-model="checkList">
            <el-row class="check-box">
              <el-col class="content-checkBox-checked"
                      :class="'content-checkBox-checked' + index"
                      :span="24"
                      v-for="(item,index) in checkBoxList"
                      :key="item.label">
                <el-checkbox :label="item.label"
                             @change="handleCheckedCitiesChange">
                  <span :style="item.style">
                    <icon-svg :name="item.icon"></icon-svg>
                  </span>
                  {{item.value}}
                </el-checkbox>
              </el-col>
            </el-row>
          </el-checkbox-group>
        </div>
      </transition>
    </div>
    <!-- 重大危险源专题 -->
    <div class="content">
      <div class="content-title"
           @click="checkboxShow2=!checkboxShow2">
        <span>
          <i v-if="!checkboxShow2"
             class="el-icon-plus"></i>
          <i v-else
             class="el-icon-minus"></i>
          <icon-svg name="wenjianjia"
                    class="content-title-icon"></icon-svg>
          重大危险源专题
        </span>

      </div>
      <!-- checkbox动画 -->
      <transition name='checkboxTopOne'>
        <div class="content-checkBox"
             v-if="checkboxShow2">
          <el-checkbox-group v-model="checkList2">
            <el-row class="check-box">
              <el-col class="content-checkBox-checked"
                      :class="'content-checkBox-checked' + index"
                      :span="24"
                      v-for="(item,index) in checkBoxList2"
                      :key="item.label">
                <el-checkbox :label="item.label"
                             @change="handleCheckedCitiesChange">
                  <span :style="item.style">
                    <icon-svg :name="item.icon"></icon-svg>
                  </span>
                  {{item.value}}
                </el-checkbox>
              </el-col>
            </el-row>
          </el-checkbox-group>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { checkpointList } from '@/api/pos/checkpoint'
import { cameraList } from '@/api/sou/cameraManagement'
import { beaconList, baseStationList } from '@/api/pos/device'
import { tankList, reactorList } from '@/api/sou/equlpment'
export default {
  components: {},
  data () {
    return {
      name: '',
      current: 1,
      totalPage: 0,
      checkboxShow: true, // checkbox动画
      checkboxShow2: true, // checkbox动画
      checkBoxList: [ // 在岗在位专题
        { label: 'checkpoint', value: '卡口', icon: 'kakou', style: 'position: relative;top: 1px;display: inline-block;font-size: 15px;width: 20px;left: 6px;' },
        { label: 'beacon', value: '信标', icon: 'xinbiao', style: 'position: relative; top: 3px;left: 7px;width: 20px;display: inline-block;' },
        { label: 'station', value: '基站', icon: 'jizhan', style: 'position: relative; top: 3px;left: 7px;width: 20px;display: inline-block;' }
      ],
      checkBoxList2: [ // 重大危险源专题
        { label: 'tank', value: '储罐', icon: 'tank', style: 'position: relative;top: 1px;display: inline-block;font-size: 15px;width: 20px;left: 6px;' },
        { label: 'device', value: '反应装置', icon: 'device', style: 'position: relative; top: 3px;left: 7px;width: 20px;display: inline-block;' },
        { label: 'camera', value: '摄像头', icon: 'camera2', style: 'position: relative;top: 1px;display: inline-block;font-size: 15px;width: 20px;left: 6px;' }
      ],
      checkList: [], // 选中列表
      checkList2: [], // 选中列表
      dataList: [], // 点位信息暂存处
      imageList: { // 图标base64列表
        checkpoint: { size: 24, offset: 50, base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAeCAYAAAA2Lt7lAAAEPElEQVRIS62We2xUVRCHv9mlpdVtCU8tBWmgEKDRNBKaEnm0kCIoqE2IxgJR/pCSICYYQWoaqIDyEKNBSSj+AUaKiUIaDSjQUgENGOKDCMSmPKxgqUELFivSdnfHzN3ta727W6KT7GY3Z858c+b87swVYpiqjgSeBqYDWcBgQIEm4CxQA3woIpeihRG3BVXNADYB8xQ89c1w/rrS9HfIe0ASjBkgZPQDEYLAPmCliNRHxvsXQFWLgPLWAL5P6pTKOrja4p7fUB88McY+Ql8v5rVERCq6e/cAqOqLwJYff1dZdwIa/oxVwK41A5U+BFmDxMq3QkTe7FjtBKiq1briRIPK6uPQbge/A0vwQNkUmDzMgSwQkT223QGo6n12abVNmrKsCtoCdxC5m6tBthbA+EFi5coSkcsdgIq2AEWLDii/9LIs0VKwcr0/R0j0OuoqElUdAVzcW6ved76NnvnEtCCFo5UEb0+fxhbY/r2HW/6u61z6IDw5TqwOmQZYpbBhwaexs68s9DMg2T2Bbd95+KjW07mY7oOKx8QkXGKAw/XNFDyz3+4mulU95bdjc/kmDEsBTzf97TzjYdeZLoBFsTJl9KPaAI2HLum9r5+MfbEG8Aos3O8la7BSkhvshLgBXpkED4+UXw3grzin3h2n4wPsBD81w/IjXibco5RMCtLHA26A4mwoyhK/Adr3nNM+5d0AI1KVzfk9tfpClddq6thtP/zRKszNDPJSTtAVsDgb5mdJwADXPruogzd93XUCy2pQcs872ZIfwHT+VzusO+F1fr82LcCQu9xP8HIuPDJKfjPAsbrrOvW5z+OXyO5gWbWX1gC8PSNASmJoj1uJ3pvtNMRjBigLKmvmVXZ1SzdUh4qq6oWcNKVf3y6vSMDAZNhbKCaCtQYYb21i5w8qu87El6mbRyTg2fth0QPOhYW+VfVQSxsz7WG70eoO+fhxP0Pudl/b+o2HfXWh56B/EuyeK/gSqRaRgg5ANnDqZIMmlBwNjaxIGzdQmTMqiLfn88S1W8Lus0JbUJzOuSEPJqWLH5goIqe7t+tVtr63VonVk2JJYdkEmDfWCVkiIhvtR+TAKQcW1/ysmGxN772xpD5Qkgt5I5xwO0SkuGNfJMD+lwGlF26oZ+UXdM7haCBTzOZ8yOwvNqLW234RZ+g4Fm3oF9p0a2zR5OVHwFqym6X54K0ZkOYTex2YLyKVkX6ugLCyJgMHrrZo6pKD0ByhLnsOts+CoT65CTwqIl+5JREVEIZMA6q+vKIJpcd7bl8/FaYMl3agQESORSthTEAYshp4dUWNcqoxFCYnDd6Y7mxdIyJrYwmhN4Ak4EJtk6YXHwyFKp8FYwdKgzMSRW7/J0D4FEuBd1cdDYljY56T1/Misi2ejOOeIAywvnn+yk3n9YbhqXIZGC0ibf8LIAyZCXwQDrhQRA7HC27r/wByoK+ZERwUDgAAAABJRU5ErkJggg==' },
        camera: { size: 24, offset: 0, base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAEJElEQVRIS8WXfUyVdRTHv+e5ukmNF4G8d+AaeFkUV8p1gaGbFkIuAnOEqLxMW81BNbYWGqlJjV6Ioa1WTZxZy+2iBXill0FkIDhb4+Uf4bJeZGPUkosDCSYX8D7Pab/HcblX7r08sCW//57nd875nHN+5zm/8xA0LI6KWoU1AemyQttAZCbAyECwUCXgXwb6wdytk7gZw45GGhiYWsgs+RMYT3o4LECWSiSJihhYrcoaDMCDUaCgIPWRx8eBwQFgaEh9JuCmonC1Q6ccD+r4bcSXfZ9gZ4JpL4g/BCgMxhhQVjboiRTQGr1XWzxsB7e1gq31QP814dIImF5b0WU7401hHpjN5pUyOapB9AL0ekivHgClpALkNzlztpnBrT9D+egYYLcDzF/oOKCIurtvuzvgYU2FSlP1ALbTlidBZeWgwMCFjst7BiYmwOVl4PZLYv87nbIq2x3uAXYmxJ0WkdKOLEhvvAlI0pKgLiVFgfLBu+AGqxr5iq6+F2f3XOA7Z4qvRKRS5fEFoTZbn2rDZIrz75yAl5bciZyxb/bMVbCo3vtY+h16Q5hkqdWU3pMnT6nAwsL9C2aFJyag5OcA9qGRSVJiRbWr4NvmuPdJokNSRRVoa9qChoTAYsDqZ9dyEcqhg2CFK1Z29x0m0RyUB+7/h40xq3WWbzRX72LBYIacvwvUf+2mdONWBHHSI1kyS+fpQCmknD2aol1KxEJHqT0HPlYJHSnPkTMh7gSIiqRvm0D6+c2h19aHgoLnYTSuQ17ubmRkpKO27jyOHn0bT6WloqqqAiEhIZocZrsdyrNPiwqvJmeiqQMGQ6KuodGrcmHhK/j89JeuveDgYOzMzkJqagquXx+CMWYdtmdmaAILIXlHumivnSQnmkY4KTlU98mJecrT09OIiIzG2NiYV8Nr10Yid88u5OXn4tH49ZrgcvFLoI5fR0XETkrbppPeq5ynaLU2YGdOriaD8fHr8frBEuTl7fYrrxwpBV9slv2CBVTAta7Q0FDcGP5bG9hXqh0OB8LCIyDSrXVlZj6Dhgt1fsXdU+21uGRZhjlhI3p6erVycbbmDG5NTqKzswtXr/YgPDwcF6y1Hvqu4vL3OQl4W/tl1NR8jfp6K8bFpe9jBQYGou3ST3jcnOySKCraj88+/dj17PE5aW0gU1NT+P6HRlgsZ9HU1IyZmRkPF/btLUBs7EM4fKTM9f5yews2bZpzxKOBLKVljo6Ooq7OCkvNOVy58guYGa0tP6rg5I1bMDj4F6Kjo/DnHzbQ7ABxd8sU7i3lkpgNS0CEIxs2PKa+6um1YfPmrSgufhnvlL81l+a7Lwmxs5Rr0V/Fibs6MjLC1Up9XovCyGIHAc2l7m8QmDWyLKOPgC/bsOeC3+vx1v3c7vlA7w5fll8Ydwf+j5+2/wC8WFebRNELnQAAAABJRU5ErkJggg==' },
        beacon: { size: 9, offset: 0, base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOBAMAAADtZjDiAAAAJ1BMVEX/PCxHcEz/NSz/Oyv/PCz/Oyz/PCz/gnj/////7ez/sqz/2dX/XVBNZ9n2AAAABnRSTlP4AB1fjNfddeoaAAAAUUlEQVQI12MQFHJlCFEUZBA0SEtLYxZkEE4DAUMGhfQyIM3E4FbRBaRTGMJWdAPpVAa2k9OBdAIDG1hdAkMYmE5lcAPTKQwKYJoJbg7MXKg9ALfcHnsvWLtJAAAAAElFTkSuQmCC' },
        station: { size: 24, offset: 0, base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAeCAYAAADU8sWcAAAFEUlEQVRIS62Xe0zVZRjHPw8X8Qgqog5JhLxSZHirPFqmEJlCqWEpDs0rrbUVS/8pW5iytrZmm222Cs0rE61MTNQUJefM4zBBapQoKl5xKuIVEfBtDweEwznHcyifv875vc/7fJ/b+32fV/gPYoyZDqQD/YHjwBIRWd9WU9LWDcaYZGADFwuhfB9EjoawIWpmmohkt8Vem8CNMf5AKRVHH2fdWLhfBz5+MGMX9Bh0GhggIrXeOtBW8LnACn6cBmW7mjH6joU3Nuj/eSKy8pGDG2P8gL+5VNyP1bHO9mflQ2jMCeBJEanzxgGvIzfGzAJWsXkGHN/ubLt/AiSt0++zRWT1IwM3xvQCCqgoCmVNPGBc2BaYmQc9Bl8CnhWRs54c8Bi5MWY88A01NyNYPw6u/OPeZrcnYPpOCOh4BnhHRHY8zIEH4MaYrkCMdmzj+dUzrGeoF1WnIGceVBR5CkYjh4krILi36mr0hY1coHxQChSLyFVdlMbjswxIBbSpoK6GBkCN8mQelGyG+hrPwE0avgEQnQR94kGzoY74BTStajNmAmkKvgT4hMJVUJoLlSfg5nkw970H86QpPtCxJ4T0gwGJMGS27shQ8ApKc0P5+S1PJqD7UxD1GvR8DoIjwb8D1N2FqnK4cBhKt3lXmtfXqhOXFLwO2zJf9mkC3IjWMXYxRLzg2cHzBZC/CM4fcq87Oh2safUKfpDrZ62siYPqSucN1g9g1Efg42tf07Kc3GPvh5ob0C4IukZBnzh7fVW0ZLavYP9nzuWzhMDMvdC5l03BRwJ5XC6xkJ0Edy43O9BvHEzOsv+/XAJ70+F0vvuIwkdAXEbTRQM73ofixv26q0N3SN4M3aOrgfiGo2aMeRnI4coxC9kT4XYLB0YthKAw2LUA6u9Bu0Donwhhw8DSBWquw8Uie731t140sUvA3wI75zcTUqAC50C3KAWeKCK7W57zOGArlWWBZCU6ZqAp1iFz4MWPoX2wc/T3bsGBL6BguUbjuK4Rp+RCSN/bwAQR2asKDgxnjBkNbOecrQNZrzrSqEabtNZutLYazuyHGxcgKBQiR9lrr9I61QqRsg3CrXeABBHZ1+SZE70aY+YAK9kyG45tdYxgzGLoGAZ5Hzo2Z0AnGPMpiDimWndHTYBJq/TXXBH5vqVBV+A+QDnHfglni15kbqR3nDYOVB6Hst2NXa3mWqV80mrlhnNApIg4MJfLi8UYs5HKE1PIHO4aeWAyJC5vXtuzEA5/61o39ZAy2yYRmdpawR34eq6dSuG7Z9xHHpsBfV6CikLY/p57On77MHTpnSUiOnQ6iDvwg5Tvt5I9yT24tyvJW7QhbSIywiO4MUYdquKPzE4NjfV/Jf5zGJZ6AwgWEYeGcNVwEQ0N9+sCKPJqGnq4e4NnwStLVUcbToeMB+IKPAHIJSsBzrm5HPwD4bGhYOkK1VfhwhGoVf5wIeHDIaVh5ksUEYfhzxW4fTz+OsZ+r7eUoB4wcgE8PQ38LM0rddXw5wb4fSncqnDco/f4u8X6zWmsdgU+BshnRxoUN76AlE6taTA0VTlbHwU6pm4C1LuewBRgBrXV/hzJBNsyuFtldyJmOozXQYlYEfnNU9qVZA5Qf8/KXxvt41P0m9C+sxKEPofSRaSsdYKNMX31zQYkc/e6DyU/gI5TA6eCbzsb8Ly3JNMF+BKYDOgTSafQxSJy1FPzG2MGAYsAnXo1Sz8B80XkWuu9/wIgksaIcgGRvQAAAABJRU5ErkJggg==' },
        tank: { size: 24, offset: 0, base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAADHElEQVRIS8WXW0yOYRzAf49QCakvh2IzQiZNE2Ns5MacJ43MIZOxbnIhNxpXjBtccKExTA4Tc5jz3IiNRWVZakLM1sGpEyKRx/7f+7729X6n+tjnufq+9/3/n9/zPz7/V9GNpbUOA+YDc4EUIB6INFVbgRqgDLgN3FRKtfvbVvkS0Fo7gFwgG4hyyjbXwoeX8LXFUO03CAaPgagR1lbNQD6wTynV6G1/r2CtdSawH3DQUAXFJ6HyBrQ2eN4rMhYSF8D0tRA7QWQEukUpVeBJwQ2ste5jnjiLljq4sgMqrvnzXNf3SYtgyU4YNFyeHxOPKaV+uAp1AZvQC8Bint6Ewhxo/9QzqCUdNhAyDsJESQ2uAumucDv4KJDFw1NwYSvoX4FBLS3VC9L3wrQ1TsuVUhv+vLJ+mDE94bS0YP3fQ13hmccty9dZMXdabGZvNS11DvbNDty93vwjbs+9KzGXhEuQbLfAu4FtFGR5T6SIaEicB45REB4JfSMMTEcbfGuFxtdQeQvamjzjJeEyJc/Yo5TKU2ZzqKehKor9qe5KvUNhVT4kLexevCuuw5ls+PndXX5LkZSa1HmcgNOAi1zaBg8kt2xLLBSFvuHdA3d8w2mAeMC+ZmyAtD3ydJmADzk7065kaK13F45wgFidshziZ8LQBBgwBHqFGLK/OuHze3hXDTX3oey8YW2bh6YVGQfby0UrX8CPaK6dyu7Jni2ashLm5MCTK/CmxGiXXz52le0fY7TNkVNh0hK4cxBKz3reL++xtNcSATfyvCiaIyu8gzMOuL+zalxq1b4KN3sHbzwH41KbBPyT8sshnN7UM7CviPsCrz4MyUs7/ys4MFcHarGLq/0nl6cYBwp2SS7f5SRZ/a/AtnLy3UCmZBjXW0+WXKelhX4biMxT3ltmRIzRY0dP7x76VTHOnt9mq3XRdm2Z8l9r7f+SiE2EsbNg2HiQMSe0v3GQ71+McejtM3hxDxoqPR/QfkmYYBnqgn8tmnAZ7oI7CFi+0VoHf/QxrZYJM/jDngtcBvLgjbeu6Rj0gd4GD/4njO0A//yj7Te1S5VQbd9hyAAAAABJRU5ErkJggg==' },
        device: { size: 24, offset: 0, base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAErUlEQVRIS72Xa0ybVRjH/6cXaAuUQrkNB87hIBLGMhBwwywkC8gM2xj4ATWZ2YzJNLoPM1Fn4lc1Ji66mEhMdGGJOBOdF7KxS8zGBsSBoOJkwmQqsNEBpS+UXnnLMc/blvbt23bDGM63nvd5zu881/OU4T4W51wHYBeAOgDlAAoApAZU5wGMARgAcAFAJ2PMfa9jWTwBzrkZwKsADgFII1mHIMI+I8LrWpZUE/QqpGRqkGTSBI+yAWgF8D5jzBrr/Jhgzvl+AMcAmAWLF2N9DkwOu+Ba8EU9S29UY32xHgWVSTDlJJAMQY8wxk5GU1CAOefawI0POgURP58VMHHddS/Pyb7nleix9UkTDH4vfEYeY4wthQvJwAHo1wB2Tw47ce2rOSy5+aqgQWGtjqHqqXSsLzbQVgeA5nB4JPhTAAfH+hfR/60N+G/M0EUZUNGYhoKKZMlyxtjzwY8r4EBM28jS7s+tK9C8zTowBlj+9MDrjH4TTQIDUyG6dxjw+LPmoOXPBWMugQPZO+IURHPncUvoAAY0vp4lXfJquw3WcVmYpP2iagO2PJEiXe6Pbid+PW9XhIbcvutwDsWcEq6Isj0IfhvA0Z722VUlUoKBofFoFlSqUMQ6P5zF/LSogFPCVT+TQfvvMMbeZIHmcEeweNPOHb8rU9AbVdgbsLj3lIDx3+R9IdmsRsORTJnOxVYrrBNKz5BQ/eFsKjWq81wC7wNweuB7G27+uCg7hOJmMKqlPY9zGaI3FOOUDDXqXjJDm6ha0bk75sGlE7GTctNjySjfI/WhJgJ/THX23bt3FM3BmKlGVbNJOnik14HxoZDFaQ9oUPdiBlzzPvR+KUCtZZi+5QWPUwnUZPa+kUvHtRK4zyGIFR3vTSnikrlBi50vUNcEhi7aMXzZIZOhi3mcHB6Hv33ez9r92jpqr/0EtlpuutMvn5hR6OUWJWLHfsk1GO5axNCFRTyyIwnrChMVsoNnFiBMKZMqUrDmQCZyNunmCCyODznVvaeU/ZxquLrF7+qxfid+OWfHo3uMeHCLXgG+ctKGmX+8WBY5fHH421vMyC81+OKCN5brUdnkf/1mJ7z4e9CNDVt1yMiXHgHZGulxwD7rgyaRSa7/azB6fw8Hx3R14TYDyhqMEmDiuhs9Xwioak7FQ2VKi7va5jA16kWCnqFkZzJuXHHAtaCMfbirYyZXcU0SSmtTJPDUqAddbTZsbzEhfzPNBfLV3W6TLK5/2QwWaCh938zj1k9yy8OTK2Y5ldYmo7hGavBS/H74ZA41B9KQ87AyuQY6FjB3ewm1h/xVQIsSbrTXufI7spxiNpCyhhQUbkuSFG1TSzj/kRX1r5hhyqEnW75uXHVg8nd3XHBkAyG/RW2ZlU1GbCyX3lPYrSLOHJtF81tZ0OpC3SqIJyjB41ksa5mkyDmP+khUP21CXok/ni67D2c/IHC2wlraWJgWce30fEyw4pEIgCkwimcxNVuDRIPfuuVlDtvtJZjzlKUU/C5YRKTnhsJAXqLMjvksBuA03CkGgajmrWYz3iAQPIdzvvajT8Bq8tPaD3thcBrI1268DQ/dmg/0EfC1/wsTcYH//U/bvwvzdV9s5PQkAAAAAElFTkSuQmCC' }
      }
    }
  },
  created () {
    this.getDataList()
  },
  mounted () { },
  computed: {},
  watch: {},
  methods: {
    // 选择框点击事件
    async handleCheckedCitiesChange (status, event) { // status：true打开，false关闭
      let name = event.currentTarget.value // 按钮value
      if (status) { // 打开
        let cnName = await this.getDataList(name)
        this.drawObjects(name, cnName)
      } else { // 关闭
        this.removeObjects(name)
      }
    },
    async getDataList (name) {
      let cnName = ''
      switch (name) {
        case 'checkpoint': // 获取卡口
          await checkpointList({}).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataList = data.page.list
            }
          }).catch((err) => {
            console.log(err)
            this.dataList = []
            this.$message.error('未知异常！请联系管理员')
          })
          cnName = '卡口'
          break
        case 'camera':
          await cameraList().then(({ data }) => {
            if (data && data.code === 0) {
              this.dataList = data.page.list
            }
          }).catch((err) => {
            console.log(err)
            this.dataList = []
            this.$message.error('未知异常！请联系管理员')
          })
          cnName = '摄像头'
          break
        case 'beacon':
          await beaconList({}).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataList = data.page.list
            }
          }).catch((err) => {
            console.log(err)
            this.dataList = []
            this.$message.error('未知异常！请联系管理员')
          })
          cnName = '信标'
          break
        case 'station':
          await baseStationList({}).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataList = data.page.list
            }
          }).catch((err) => {
            console.log(err)
            this.dataList = []
            this.$message.error('未知异常！请联系管理员')
          })
          cnName = '基站'
          break
        case 'tank':
          await tankList({}).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataList = data.page.list
            }
          }).catch((err) => {
            console.log(err)
            this.dataList = []
            this.$message.error('未知异常！请联系管理员')
          })
          cnName = '储罐'
          break
        case 'device':
          await reactorList({}).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataList = data.page.list
            }
          }).catch((err) => {
            console.log(err)
            this.dataList = []
            this.$message.error('未知异常！请联系管理员')
          })
          cnName = '反应装置'
          break
      }
      return cnName
    },
    drawObjects (name, cnName) {
      if (this.dataList.length > 0) {
        let points = this.dataList.map(res => {
          return {
            x: res.positionX || res.x,
            y: res.positionZ || res.z,
            z: res.positionY || res.y,
            id: res.id,
            name,
            cnName: res.name,
            data: {
              '备注': res.remarks
            }
          }
        })
        let objects = {
          typeName: name,
          iconBase64: this.imageList[name].base64,
          iconSize: this.imageList[name].size,
          iconOffset: this.imageList[name].offset,
          point: points
        }
        this.$emit('handleClick', 'init-objects', objects)
      }
    },
    removeObjects (name) {
      this.$emit('handleClick', 'remove-objects', name)
    }
  }
}
</script>

<style lang='scss'>
.map-coverage-list-container {
  .content {
    padding-top: 10px;
    padding-left: 10px;
    .content-title {
      cursor: pointer;
      font-weight: 500;
      color: #606266;
      margin-bottom: 5px;
      & > span > i {
        border: 1px solid #606266;
        transform: scale(0.9);
      }
      &-icon {
        margin-left: 11px;
        font-size: 14px;
        margin-bottom: -2px;
      }
    }
    .el-checkbox {
      &__label,
      &__input {
        font-size: 12px;
      }
      &__label {
        padding-left: 5px;
      }
    }
    .check-box {
      font-weight: normal;
      padding-left: 20px;
    }
  }
}
</style>
