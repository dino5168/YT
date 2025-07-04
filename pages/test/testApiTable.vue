<template>
    <ApiTable :columnUrl="columnUrl" :dataUrl="dataUrl">
        <template #cell-actions="{ row }">
            <div class="flex gap-2">
                <ButtonYellow @click.stop="editRow(row)">修改</ButtonYellow>
                <ButtonRed @click.stop="deleteRow(row)">刪除</ButtonRed>
            </div>
        </template>
    </ApiTable>
</template>

<script lang="ts" setup>
import ApiTable from '~/components/Table/ApiTable.vue'
import { ButtonYellow, ButtonRed } from '~/components/Buttons'

const baseUrl = useBaseUrl()
const columnUrl = `${baseUrl}/DBQuery/TableSchema/TABLE_SCHEMAT_COMMENT?table_name=code`
const dataUrl = `${baseUrl}/DBQuery/SELECT_CODE_ALL`

const editRow = (row: any) => {
    alert(row)
    console.log('Edit', row)
}

const deleteRow = (row: any) => {
    alert(row.id)
    console.log('Delete', row)
}
</script>
