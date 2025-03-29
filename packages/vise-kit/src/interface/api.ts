export interface ApiResponseDataMapping {
    columns: string[] // เช่น ["col1", "col2", "col3"] หรือ ["athlete","age",...]
    headers?: string[] // ถ้าอยากให้ headerName ในตารางเป็นชื่อที่สวยงาม
    data: any[] // array ของ object ข้อมูล row
    keyToAssign: string // key ที่จะ assign ค่าไปยัง input
  }
  