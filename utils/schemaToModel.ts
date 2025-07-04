//產出 python models
import type {SchemaField, ModelConfig} from "#imports";
export function schemaToModel(
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

// 生成模型
const pythonModel = schemaToModel(navItemsSchema, {
  tableName: "nav_items",
  className: "NavItem",
  addTimestamps: true,
});

console.log(pythonModel);

// 輸出結果：
/*
  from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Date, Numeric, Float, BigInteger, func
  from sqlalchemy.ext.declarative import declarative_base
  
  Base = declarative_base()
  
  class NavItem(Base):
      __tablename__ = "nav_items"
      id = Column(Integer, primary_key=True, index=True)  # ID
      label = Column(Text, nullable=False)  # 選單名稱
      href = Column(Text, nullable=True)  # 選單連結
      sort_order = Column(Integer, nullable=True, default=0)  # 顯示順序
      created_at = Column(DateTime, server_default=func.now())  # 建立時間
      updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())  # 更新時間
  */
