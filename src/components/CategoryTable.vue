<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from "vue";

interface ColumnDef {
  key: string;
  label: string;
  type: "string" | "number" | "date";
  sortable?: boolean;
}

const props = defineProps<{
  columns: ColumnDef[];
  rows: Record<string, any>[];
  enableActions?: boolean;
}>();

const emits = defineEmits<{
  (e: "modify", row: any): void;
  (e: "delete", row: any): void;
}>();

function onModify(row: any) {
  emits("modify", row);
}
function onDelete(row: any) {
  emits("delete", row);
}

const sortColumn = ref<string>("");
const sortDirection = ref<"asc" | "desc">("asc");

const sortedRows = computed(() => {
  // Copiamos el array original
  const arr = [...props.rows];

  // Si no hay columna seleccionada, no ordenamos
  if (sortColumn.value === "") {
    return arr;
  }

  // Buscar la definición de esa columna
  const colDef = props.columns.find((c) => c.key === sortColumn.value);
  if (!colDef || !colDef.sortable) {
    return arr;
  }

  const colKey = sortColumn.value;

  arr.sort((a, b) => {
    const aVal = a[colKey];
    const bVal = b[colKey];

    switch (colDef.type) {
      case "string": {
        const strA = String(aVal ?? "").toLowerCase();
        const strB = String(bVal ?? "").toLowerCase();
        return sortDirection.value === "asc"
          ? strA.localeCompare(strB)
          : strB.localeCompare(strA);
      }
      case "number": {
        const numA = Number(aVal ?? 0);
        const numB = Number(bVal ?? 0);
        return sortDirection.value === "asc" ? numA - numB : numB - numA;
      }
      case "date": {
        const dateA = new Date(aVal).getTime();
        const dateB = new Date(bVal).getTime();
        return sortDirection.value === "asc" ? dateA - dateB : dateB - dateA;
      }
      default:
        return 0;
    }
  });

  return arr;
});

function toggleSort(col: ColumnDef) {
  if (!col.sortable) return;

  if (sortColumn.value === col.key) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortColumn.value = col.key;
    sortDirection.value = "asc";
  }
}
</script>

<template>
  <div class="table-container">
    <table class="table table-hover table-striped table-bordered mb-0">
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            @click="toggleSort(col)"
            :style="col.sortable ? 'cursor: pointer;' : ''"
          >
            {{ col.label }}
            <span v-if="sortColumn === col.key">
              <span v-if="sortDirection === 'asc'">▲</span>
              <span v-else>▼</span>
            </span>
          </th>
          <th v-if="enableActions" class="text-end">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in sortedRows" :key="idx">
          <td v-for="col in columns" :key="col.key">
            {{ row[col.key] }}
          </td>

          <td v-if="enableActions" class="text-end">
            <button class="btn btn-warning me-2" @click="onModify(row)">
              Modificar
            </button>
            <button class="btn btn-danger" @click="onDelete(row)">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-container {
  border-radius: 8px;
  overflow: hidden;
}

table thead {
  background-color: #d1fcd3;
}
</style>
