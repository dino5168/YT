// 產出 interface
import type {SchemaField, ModelConfig} from "#imports";
export function schemaToInterface(
  schema: SchemaField[],
  config: ModelConfig = {}
): string {
  const {
    tableName = "your_table",
    className = "YourModel",
    addTimestamps = false,
    primaryKeyField = "id",
  } = config;

  // 資料型別對應表
  const typeMapping: Record<string, string> = {
    integer: "Integer",
    text: "Text",
    varchar: "String",
    "character varying": "String",
    boolean: "Boolean",
    timestamp: "DateTime",
    date: "Date",
    decimal: "Numeric",
    numeric: "Numeric",
    float: "Float",
    double: "Float",
    bigint: "BigInteger",
  };

  // 生成導入語句
  const imports = [
    "from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Date, Numeric, Float, BigInteger, func",
    "from sqlalchemy.ext.declarative import declarative_base",
    "",
    "Base = declarative_base()",
    "",
  ];

  // 生成類別定義開始
  const classStart = [
    `class ${className}(Base):`,
    `    __tablename__ = "${tableName}"`,
  ];

  // 生成欄位定義
  const fields: string[] = [];

  schema.forEach((field) => {
    const fieldName = field.欄位名稱;
    const dataType = field.資料型別.toLowerCase();
    const nullable = field.可為NULL === "YES";
    const defaultValue = field.預設值;
    const description = field.欄位描述;

    // 決定 SQLAlchemy 型別
    let sqlType = typeMapping[dataType] || "String";

    // 如果是字串類型且有最大長度，使用 String(length)
    if (
      (dataType.includes("varchar") || dataType.includes("character")) &&
      field.最大長度
    ) {
      sqlType = `String(${field.最大長度})`;
    }

    // 建立欄位定義
    let fieldDef = `    ${fieldName} = Column(${sqlType}`;

    // 添加主鍵
    if (fieldName === primaryKeyField) {
      fieldDef += ", primary_key=True, index=True";
    }

    // 添加 nullable
    if (!nullable && fieldName !== primaryKeyField) {
      fieldDef += ", nullable=False";
    } else if (nullable && fieldName !== primaryKeyField) {
      fieldDef += ", nullable=True";
    }

    // 添加預設值
    if (defaultValue && !defaultValue.includes("nextval")) {
      if (defaultValue === "0" || defaultValue === "1") {
        fieldDef += `, default=${defaultValue}`;
      } else if (defaultValue.includes("now()")) {
        fieldDef += ", server_default=func.now()";
      } else {
        fieldDef += `, default="${defaultValue}"`;
      }
    }

    fieldDef += ")";

    // 添加註解
    if (description) {
      fieldDef += `  # ${description}`;
    }

    fields.push(fieldDef);
  });

  // 添加時間戳欄位（如果需要）
  /*
  if (addTimestamps) {
    fields.push(
      "    created_at = Column(DateTime, server_default=func.now())  # 建立時間"
    );
    fields.push(
      "    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())  # 更新時間"
    );
  }
*/
  // 組合所有部分
  const result = [...imports, ...classStart, ...fields].join("\n");

  return result;
}

// 使用範例
const navItemsSchema: SchemaField[] = [
  {
    欄位名稱: "id",
    資料型別: "integer",
    最大長度: null,
    可為NULL: "NO",
    預設值: "nextval('nav_items_id_seq'::regclass)",
    欄位描述: "ID",
  },
  {
    欄位名稱: "label",
    資料型別: "text",
    最大長度: null,
    可為NULL: "NO",
    預設值: null,
    欄位描述: "選單名稱",
  },
  {
    欄位名稱: "href",
    資料型別: "text",
    最大長度: null,
    可為NULL: "YES",
    預設值: null,
    欄位描述: "選單連結",
  },
  {
    欄位名稱: "sort_order",
    資料型別: "integer",
    最大長度: null,
    可為NULL: "YES",
    預設值: "0",
    欄位描述: "顯示順序",
  },
];

// TypeScript Interface/Type 轉換函數
export function schemaToTypeScript(
  schema: SchemaField[],
  config: TypeScriptConfig = {}
): string {
  const {
    typeName = "YourType",
    useInterface = true,
    addTimestamps = false,
    exportType = true,
    camelCase = false,
  } = config;

  // 資料型別對應表
  const tsTypeMapping: Record<string, string> = {
    integer: "number",
    bigint: "number",
    text: "string",
    varchar: "string",
    "character varying": "string",
    boolean: "boolean",
    timestamp: "Date",
    date: "Date",
    decimal: "number",
    numeric: "number",
    float: "number",
    double: "number",
  };

  // 轉換欄位名稱格式
  const formatFieldName = (name: string): string => {
    if (!camelCase) return name;
    return name.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  };

  // 生成欄位定義
  const fields: string[] = [];

  schema.forEach((field) => {
    const fieldName = formatFieldName(field.欄位名稱);
    const dataType = field.資料型別.toLowerCase();
    const nullable = field.可為NULL === "YES";
    const description = field.欄位描述;

    // 決定 TypeScript 型別
    let tsType = tsTypeMapping[dataType] || "string";

    // 如果可為 NULL，添加 undefined
    if (nullable) {
      tsType += " | null";
    }

    // 建立欄位定義
    let fieldDef = `  ${fieldName}`;

    // 如果可為 NULL，添加可選標記
    if (nullable) {
      fieldDef += "?";
    }

    fieldDef += `: ${tsType};`;

    // 添加註解
    if (description) {
      fieldDef += ` // ${description}`;
    }

    fields.push(fieldDef);
  });

  // 添加時間戳欄位（如果需要）
  /*
  if (addTimestamps) {
    const createdField = camelCase ? "createdAt" : "created_at";
    const updatedField = camelCase ? "updatedAt" : "updated_at";
    fields.push(`  ${createdField}?: Date; // 建立時間`);
    fields.push(`  ${updatedField}?: Date; // 更新時間`);
  }
*/
  // 生成類型定義
  const typeKeyword = useInterface ? "interface" : "type";
  const typeDefinition = useInterface
    ? `${typeKeyword} ${typeName} {\n${fields.join("\n")}\n}`
    : `${typeKeyword} ${typeName} = {\n${fields.join("\n")}\n}`;

  const exportKeyword = exportType ? "export " : "";

  return `${exportKeyword}${typeDefinition}`;
}

interface TypeScriptConfig {
  typeName?: string;
  useInterface?: boolean;
  addTimestamps?: boolean;
  exportType?: boolean;
  camelCase?: boolean;
}

// 使用範例 1: 生成 Interface
const tsInterface = schemaToTypeScript(navItemsSchema, {
  typeName: "NavItem",
  useInterface: true,
  addTimestamps: true,
  exportType: true,
  camelCase: false,
});

console.log("=== TypeScript Interface ===");
console.log(tsInterface);

// 使用範例 2: 生成 Type (駝峰命名)
const tsType = schemaToTypeScript(navItemsSchema, {
  typeName: "NavItemType",
  useInterface: false,
  addTimestamps: true,
  exportType: true,
  camelCase: true,
});

console.log("\n=== TypeScript Type (CamelCase) ===");
console.log(tsType);

// 輸出結果：
/*
  === TypeScript Interface ===
  export interface NavItem {
    id: number; // ID
    label: string; // 選單名稱
    href?: string | null; // 選單連結
    sort_order?: number | null; // 顯示順序
    created_at?: Date; // 建立時間
    updated_at?: Date; // 更新時間
  }
  
  === TypeScript Type (CamelCase) ===
  export type NavItemType = {
    id: number; // ID
    label: string; // 選單名稱
    href?: string | null; // 選單連結
    sortOrder?: number | null; // 顯示順序
    createdAt?: Date; // 建立時間
    updatedAt?: Date; // 更新時間
  }
  */
