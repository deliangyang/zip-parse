interface Item {
    name: string
    map: Array<string>
}

interface SheetMap {
    [key: string]: Item
}

export let sheetsMap: SheetMap = {
    items: {
        name: '物品配置',
        map: [
            'weight#n',
            'id#n',
            'name.cn#s',
            'name.tw#s',
            'name.hk#s',
            'gender#n',
            'categoryId#n',
            'layerId#n',
            'level#s',
            'fashionValue#n',
            'image.thumb#s',
           // 'image.original',
            'slice.up#s',
            'coordinateUp.x#n',
            'coordinateUp.y#n',
            'slice.down#s',
            'coordinateDown.x#n',
            'coordinateDown.y#n',
            'obtain.cn#s',
            'obtain.tw#s',
            'obtain.hk#s',
            'link#s',
            'onlineTime#n',
            'type#n',
            'number#n',
            'refItemId#n',
            'flash.normal#n',
            'flash.small#n',
            'flashLayer#n',
        ],
    },
    categories: {
        name: '类别配置',
        map: [
            'id#n',
            'rejectId#s',
            'name.cn#s',
            'name.tw#s',
            'name.hk#s',
            'gender#n',
            'slice.normal#s',
            'slice.grey#s',
            'reviewPic#s',
        ]
    },
    boxes: {
        name: '礼盒配置',
        map: [
            'weight#n',
            'id#n',
            'name.cn#s',
            'name.tw#s',
            'name.hk#s',
            'price.oneTimes#n',
            'priceStep#s',
            'price.tenTimes#n',
            'lotteryGoods#s',
            'cover.female#s',
            'cover.male#s',
            'cover.normal#s',
            'freeCd#n',
            'onlineTime#n',
            'effectId#n',
            'effectStep#s',
        ]
    },
    boxItems: {
        name: '礼盒详情配置',
        map: [
            'boxId#n',
            'itemId#n',
            'chance#n',
        ]
    },
    layers: {
        name: '层级配置',
        map: [
            'id#n',
            'categoryId#n',
            'layer.up#n',
            'layer.down#n',
        ]
    },
    effect: {
        name: '上麦动效配置',
        map: [
            'weight#n',
            'id#n',
            'effectSingId#n',
            'name.cn#s',
            'name.tw#s',
            'name.hk#s',
            'obtain.cn#s',
            'obtain.tw#s',
            'obtain.hk#s',
            'image#s',
            'link#s'
        ]
    },
    allEffect: {
        name: '动效配置',
        map: [
            'weight#n',
            'id#n',
            'category#n',
            'effectSingId#n',
            'name.cn#s',
            'name.tw#s',
            'name.hk#s',
            'obtain.cn#s',
            'obtain.tw#s',
            'obtain.hk#s',
            'image#s',
            'link#s'
        ]
    },
    defaultConfig: {
        name: '默认物品配置',
        map: [
            'id#n',
            'name#s',
            'gender#n',
            'categoryId#n',
            'layerId#n',
            'picUp#s',
            'upCoordinate.x#n',
            'upCoordinate.y#n',
        ]
    }
}

