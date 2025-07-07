<template>
    <div class="p-6 space-y-6">
        <h1 class="text-xl font-bold">指定角色選單 <span class="text-red-500">會先刪除舊有資料然後新增</span></h1>
        <div class="flex items-center mb-4 w-80">
            <label class="text-sm font-medium mr-3 whitespace-nowrap">選擇角色：</label>
            <ComboBoxApi v-model="selectedValue" api-url="COMBo_ROLE_LIST" placeholder="請選擇一個角色" class="flex-1" />
        </div>
        <div class="space-x-2">
            <ButtonBlue @click="toggleSelectAll(true)">全選</ButtonBlue>
            <ButtonGray @click="toggleSelectAll(false)">取消選取</ButtonGray>
            <ButtonRed @click="onUpdate()">確定修改</ButtonRed>
            <ButtonRed @click="onTest()">測試</ButtonRed>

        </div>
        <!-- 完整選單表格 -->
        <XTable :rows="allMenuItems" :columns="allColumns" :column-descriptions="allColumnDescriptions" :pageSize="100">
            <template #cell-is_Selected="{ row }">
                <input type="checkbox" v-model="row.is_Selected">
            </template>
            <template #cell-level="{ value }">
                <span :class="value === '主選單' ? 'font-bold text-blue-600' : 'text-gray-600 ml-4'">
                    {{ value }}
                </span>
            </template>
            <template #cell-label="{ value, row }">
                <span :class="row.level === '主選單' ? 'font-bold' : 'ml-4'">
                    {{ value }}
                </span>
            </template>
        </XTable>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ComboBoxApi from '~/components/SelectList/ComboBoxApi.vue'
import XTable from '~/components/Table/XTable.vue'
import { ButtonBlue, ButtonGray, ButtonRed } from '~/components/Buttons'

// 定義響應式數據來儲存選中的值
const selectedValue = ref<string | number | null>(null)

// 完整選單資料
const allMenuItems = ref<any[]>([])

const allColumns = ['is_Selected', 'level', 'id', 'label', 'href', 'type', 'sort_order', 'parent_label']
const allColumnDescriptions = ['選取', '層級', 'ID', '標籤', '連結', '型態', '排序', '父選單']

const baseUrl = useBaseUrl()
const urlNavLinks = `${baseUrl}/nav/links`
//切換 全選 checkBox
const toggleSelectAll = (flag: boolean) => {

    allMenuItems.value.forEach(item => {
        
        item.is_Selected = flag
    })

}
//const baseUrl = useBaseUrl()

//通知 Server 端修改資料 : 先刪除然後新增
const onUpdate = async () => {
    if (!selectedValue.value)
        return

    const selectedItems = allMenuItems.value.filter(item => item.is_Selected)
    const filter = selectedItems.map(({ type, id }) => ({ type, id }))
    const payload = {
        role_id: selectedValue.value,
        menu_items: filter
    }
    //
    const response = await fetch(`${baseUrl}/DBCreate/TABLE_INSERT_M/INSERT_NAV_ITEM_ROLES`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })

}




// 將原始資料扁平化
const flattenMenuData = (rawData: MenuItem[]): FlattenedMenuItem[] => {
  const flattenedData: FlattenedMenuItem[] = []
  
  rawData.forEach((mainItem) => {
    // 加入主選單
    flattenedData.push({
      is_Selected: mainItem.is_selected,
      level: '主選單',
      id: mainItem.id,
      label: mainItem.label,
      href: mainItem.href || '',
      type: mainItem.type,
      sort_order: mainItem.sort_order,
      parent_label: '',
      nav_item_id: mainItem.nav_item_id,
    })

    // 加入子選單
    if (mainItem.dropdown && mainItem.dropdown.length > 0) {
      mainItem.dropdown.forEach((subItem) => {
        flattenedData.push({
          is_Selected: subItem.is_selected,
          level: '子選單',
          id: subItem.id,
          label: subItem.label,
          href: subItem.href || '',
          type: subItem.type,
          sort_order: subItem.sort_order,
          parent_label: mainItem.label,
          nav_item_id: subItem.nav_item_id,
        })
      })
    }
  })

  return flattenedData
}

// 排序邏輯
const sortMenuItems = (flattenedData: FlattenedMenuItem[], rawData: MenuItem[]): FlattenedMenuItem[] => {
  return flattenedData.sort((a, b) => {
    // 主選單 vs 主選單
    if (a.level === '主選單' && b.level === '主選單') {
      return a.sort_order - b.sort_order
    }
    
    // 主選單 vs 子選單
    if (a.level === '主選單' && b.level === '子選單') {
      const bParentSort = rawData.find((item) => item.label === b.parent_label)?.sort_order || 0
      return a.sort_order - bParentSort
    }
    
    // 子選單 vs 主選單
    if (a.level === '子選單' && b.level === '主選單') {
      const aParentSort = rawData.find((item) => item.label === a.parent_label)?.sort_order || 0
      return aParentSort - b.sort_order
    }
    
    // 子選單 vs 子選單
    if (a.level === '子選單' && b.level === '子選單') {
      const aParentSort = rawData.find((item) => item.label === a.parent_label)?.sort_order || 0
      const bParentSort = rawData.find((item) => item.label === b.parent_label)?.sort_order || 0
      
      if (aParentSort !== bParentSort) {
        return aParentSort - bParentSort
      }
      return a.sort_order - b.sort_order
    }
    
    return 0
  })
}

// 主要的資料處理函式
const processMenuData = (rawData: MenuItem[]): FlattenedMenuItem[] => {
  const flattenedData = flattenMenuData(rawData)
  return sortMenuItems(flattenedData, rawData)
}

// 載入選單資料
const loadMenuData = async (role_id): Promise<FlattenedMenuItem[]> => {
  try {
    const { data, error } = await useNavLinksRoleId(role_id)
    
    if (error.value) {
      console.error('載入 menu 失敗', error.value)
      throw new Error('載入選單失敗')
    }
    
    const rawData = data.value || []
    return processMenuData(rawData)
  } catch (err) {
    console.error('處理選單資料時發生錯誤:', err)
    throw err
  }
}

// 使用方式
onMounted(async () => {
  try {
    allMenuItems.value = await loadMenuData("1")
  } catch (error) {
    // 處理錯誤，例如顯示錯誤訊息給使用者
    console.error('載入選單失敗:', error)
  }
})

const onTest = async () =>{

  try {
    allMenuItems.value = await loadMenuData(selectedValue.value)
  } catch (error) {
    // 處理錯誤，例如顯示錯誤訊息給使用者
    console.error('載入選單失敗:', error)
  }

}

</script>