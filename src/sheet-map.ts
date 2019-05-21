interface Item {
    name: string
    map: Array<string>
}

interface SheetMap {
    [key: string]: Item
}

export let sheetsMap: SheetMap = {
    items: {
        name: '【仅开发用】服物品配置',
        map: [
            'weight',
            'id',
            'name.cn',
            'name.tw',
            'name.hk',
            'gender',
            'categoryId',
            'layerId',
            'level',
            'image.thumb',
            'image.original',
            'slice.up',
            'slice.down',
            'obtain.cn',
            'obtain.tw',
            'obtain.hk',
            'link',
            'onlineTime',
            'type',
            'number',
            'refItemId',
        ],
    },
    categories: {
        name: '类别配置',
        map: [
            'id',
            'name.tw',
            'name.hk',
            'name.cn',
            'gender',
            'slice.normal',
            'slice.grey',
        ]
    },
    boxes: {
        name: '【仅开发用】礼盒配置',
        map: [
            'weight',
            'id',
            'name.cn',
            'name.tw',
            'name.hk',
            'price.oneTimes',
            'price.tenTimes',
            'cover.female',
            'cover.male',
            'cover.normal',
            'freeCd',
            'onlineTime',
        ]
    },
    boxItems: {
        name: '【仅开发用】礼盒详情配置',
        map: [
            'boxId',
            'itemId',
        ]
    },
    layers: {
        name: '层级配置',
        map: [
            'id',
            'categoryId',
            'layer.up',
            'layer.down',
        ]
    },
    effect: {
        name: '上麦动效配置',
        map: [
            'weight',
            'id',
            'name.cn',
            'name.tw',
            'name.hk',
            'obtain.cn',
            'obtain.tw',
            'obtain.hk',
            'image'
        ]
    }
}

