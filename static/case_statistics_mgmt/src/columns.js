define([{
  display: '案发辖区',
  name: 'areaname',
  isSort: false,
  minWidth: 120
}, {
  display: '除主动管理类案件',
  minWidth: 80,
  isSort: false,
  columns: [{
    display: '本期',
    name: 'noActivemgmtCurrent',
    isSort: false
  }, {
    display: '同期',
    name: 'noActivemgmtEarlier',
    isSort: false
  }, {
    display: '同比',
    name: 'noActivemgmtRatio',
    isSort: false,
    minWidth: 130
  }]
}, {
  display: '三降案件',
  minWidth: 80,
  isSort: false,
  columns: [{
    display: '现行案件总数',
    isSort: false,
    columns: [{
      display: '本期',
      name: 'currentCaseCurrent',
      isSort: false
    }, {
      display: '同期',
      name: 'currentCaseEarlier',
      isSort: false
    }, {
      display: '同比',
      name: 'currentCaseRatio',
      isSort: false,
      minWidth: 130
    }]
  }, {
    display: '盗窃',
    isSort: false,
    columns: [{
      display: '入室盗窃',
      isSort: false,
      columns: [{
        display: '本期',
        name: 'housebreakingCurrent',
        isSort: false
      }, {
        display: '同期',
        name: 'housebreakingEarlier',
        isSort: false
      }, {
        display: '同比',
        name: 'housebreakingRatio',
        isSort: false,
        minWidth: 130
      }]
    }, {
      display: '盗窃总发案',
      isSort: false,
      columns: [{
        display: '本期',
        name: 'larcenyCurrent',
        isSort: false
      }, {
        display: '同期',
        name: 'larcenyEarlier',
        isSort: false
      }, {
        display: '同比',
        name: 'larcenyRatio',
        isSort: false,
        minWidth: 130
      }]
    }]
  }, {
    display: '诈骗',
    isSort: false,
    columns: [{
      display: '电信诈骗',
      isSort: false,
      columns: [{
        display: '本期',
        name: 'telecomfraudCurrent',
        isSort: false
      }, {
        display: '同期',
        name: 'telecomfraudEarlier',
        isSort: false
      }, {
        display: '同比',
        name: 'telecomfraudRatio',
        isSort: false,
        minWidth: 130
      }]
    }, {
      display: '诈骗总发案',
      isSort: false,
      columns: [{
        display: '本期',
        name: 'fraudCurrent',
        isSort: false
      }, {
        display: '同期',
        name: 'fraudEarlier',
        isSort: false
      }, {
        display: '同比',
        name: 'fraudRatio',
        isSort: false,
        minWidth: 130
      }]
    }]
  }]
}, {
  display: '两抢案件',
  minWidth: 80,
  isSort: false,
  columns: [{
    display: '本期',
    name: 'twoRobCurrent',
    isSort: false
  }, {
    display: '同期',
    name: 'twoRobEarlier',
    isSort: false
  }, {
    display: '同比',
    name: 'twoRobRatio',
    isSort: false,
    minWidth: 130
  }]
}, {
  display: '主动管理类案件',
  minWidth: 80,
  isSort: false,
  columns: [{
    display: '毒品案件',
    isSort: false,
    columns: [{
      display: '本期',
      name: 'hardrugCurrent',
      isSort: false
    }, {
      display: '同期',
      name: 'hardrugEarlier',
      isSort: false
    }, {
      display: '同比',
      name: 'hardrugRatio',
      isSort: false,
      minWidth: 130
    }]
  }, {
    display: '治安类刑事案件',
    isSort: false,
    columns: [{
      display: '本期',
      name: 'criminalJusticeCurrent',
      isSort: false
    }, {
      display: '同期',
      name: 'criminalJusticeEarlier',
      isSort: false
    }, {
      display: '同比',
      name: 'criminalJusticeRatio',
      isSort: false,
      minWidth: 130
    }]
  }, {
    display: '经济案件',
    isSort: false,
    columns: [{
      display: '本期',
      name: 'economicCurrent',
      isSort: false
    }, {
      display: '同期',
      name: 'economicEarlier',
      isSort: false
    }, {
      display: '同比',
      name: 'economicRatio',
      isSort: false,
      minWidth: 130
    }]
  }]
}])
