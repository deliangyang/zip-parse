interface Item {
    name: string
    map: Array<string>
}

interface SheetMap {
    [key: string]: Item
}

export let sheetsMap: SheetMap = {
    items: {
        name: '【仅开发用】物品配置',
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
            'name.cn#s',
            'name.tw#s',
            'name.hk#s',
            'gender#n',
            'slice.normal#s',
            'slice.grey#s',
        ]
    },
    boxes: {
        name: '【仅开发用】礼盒配置',
        map: [
            'weight#n',
            'id#n',
            'name.cn#s',
            'name.tw#s',
            'name.hk#s',
            'price.oneTimes#n',
            'price.tenTimes#n',
            'cover.female#s',
            'cover.male#s',
            'cover.normal#s',
            'freeCd#n',
            'onlineTime#n',
            'effectId#n',
        ]
    },
    boxItems: {
        name: '【仅开发用】礼盒详情配置',
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
            'layer.up#s',
            'layer.down#s',
        ]
    },
    effect: {
        name: '上麦动效配置',
        map: [
            'weight#n',
            'id#n',
            'effect.up#n',
            'effect.down#n',
            'name.cn#s',
            'name.tw#s',
            'name.hk#s',
            'obtain.cn#s',
            'obtain.tw#s',
            'obtain.hk#s',
            'image#s'
        ]
    }
}

