
import { find } from 'lodash'

export function date() {
  let arrDay = []

  for(let i=1; i<=31 ;i++) {
    arrDay.push({text: i, value: i})
  }
  return arrDay
}

export function month(translate) {
  let arrMonth = []

  for (let i = 1; i <= 12 ; i++) {
    if (i == 1) {
      arrMonth.push({text: translate('regis_form.month.Janury') , value: i})
    }
    else if (i == 2) {
      arrMonth.push({text: translate('regis_form.month.February') , value: i})
    }
    else if (i == 3) {
      arrMonth.push({text: translate('regis_form.month.March') , value: i})
    }
    else if (i == 4) {
      arrMonth.push({text: translate('regis_form.month.April') , value: i})
    }
    else if (i == 5) {
      arrMonth.push({text: translate('regis_form.month.May') , value: i})
    }
    else if (i == 6) {
      arrMonth.push({text: translate('regis_form.month.June') , value: i})
    }
    else if (i == 7) {
      arrMonth.push({text: translate('regis_form.month.July') , value: i})
    }
    else if (i == 8) {
      arrMonth.push({text: translate('regis_form.month.August') , value: i})
    }
    else if (i == 9) {
      arrMonth.push({text: translate('regis_form.month.September') , value: i})
    }
    else if (i == 10) {
      arrMonth.push({text: translate('regis_form.month.October') , value: i})
    }
    else if (i == 11) {
      arrMonth.push({text: translate('regis_form.month.November') , value: i})
    }
    else if (i == 12) {
      arrMonth.push({text: translate('regis_form.month.December') , value: i})
    }
  }
  return arrMonth
}

export function year(lang) {
  let arrYear = []
  let count = 0
  const currYear = (new Date().getFullYear())
  lang === 'th_TH' ? count = 543 : count = 0

  for(let i=currYear; i > currYear - 100                                           ; i--) {
    arrYear.push({text: i + count , value: i})
  }
  return arrYear
}
  
