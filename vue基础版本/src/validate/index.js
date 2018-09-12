import Vue from 'vue'
import VeeValidate, { Validator } from 'vee-validate'
import cn from 'vee-validate/dist/locale/zh_CN'

Validator.localize('cn', cn)

const dict = {
  cn: {
    messages: {
      required: (name) => `${name}不能为空！`
    }
  }
}

Validator.localize(dict)

const nameRegex = /^[．.•●A-z\u4E00-\u9FA5]+$/

Validator.extend('name', {
  getMessage: field => `请输入正确的姓名`,
  validate: value => value.length > 1 && nameRegex.test(value)
})

Vue.use(VeeValidate)

export default ({})
