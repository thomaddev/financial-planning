import axios, { AxiosError, AxiosInstance } from 'axios'

export class FrappeAPI {
  private baseURL: string
  private accessToken?: string
  private axiosInstance: AxiosInstance
  private onError?: (error: string) => void
  private getFieldMetaUrl?: string // set up api path for get meta field manual

  constructor(
    baseURL: string,
    accessToken?: string,
    onError?: (error: string) => void,
    getFieldMetaUrl?: string,
  ) {
    this.baseURL = baseURL
    this.accessToken = accessToken
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      headers: this.getHeaders(),
    })
    this.onError = onError
    this.getFieldMetaUrl = getFieldMetaUrl

    // Add a request interceptor to ensure token is always up to date
    this.axiosInstance.interceptors.request.use((config) => {
      if (this.accessToken) {
        config.headers['Authorization'] = `Bearer ${this.accessToken}`
      }
      return config
    })

    // Response Interceptor - Detect 401 errors
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          console.warn('Unauthorized request detected (401)')
          if (this.onError) {
            this.onError('Unauthorized request detected (401)')
          }
          throw new Error('UNAUTHORIZED') // 👈 This will be handled in the Next.js app
        }
        return Promise.reject(error)
      },
    )
  }

  /** Set or Update Token */
  setAccessToken(token: string) {
    this.accessToken = token
  }

  async getDocs(doctype: string, fields?: string[], filters?: string) {
    const response = await this.axiosInstance.get(`/api/resource/${doctype}`, {
      params: {
        fields: JSON.stringify(fields),
        filters,
      },
    })
    return response.data.data
  }

  async getDoc(doctype: string, name: string) {
    const response = await this.axiosInstance.get(`/api/resource/${doctype}/${name}`)
    return response.data.data
  }

  async createDoc(doctype: string, data: object) {
    const response = await this.axiosInstance.post(`/api/resource/${doctype}`, data)
    return response.data.data
  }

  async updateDoc(doctype: string, name: string, data: object) {
    const response = await this.axiosInstance.put(`/api/resource/${doctype}/${name}`, data)
    return response.data.data
  }

  async deleteDoc(doctype: string, name: string) {
    await this.axiosInstance.delete(`/api/resource/${doctype}/${name}`)
    return { success: true }
  }

  async callMethod(
    methodPath: string,
    params: object = {},
    method: 'GET' | 'POST' | 'PUT' = 'GET',
  ) {
    try {
      const url = `/api/method/${methodPath}`
      let response

      if (method === 'GET') {
        response = await this.axiosInstance.get(url, { params })
      } else if (method === 'PUT') {
        response = await this.axiosInstance.put(url, params)
      } else {
        response = await this.axiosInstance.post(url, params)
      }

      return response.data.message // Frappe returns data inside `message`
    } catch (error) {
      console.error(`Error calling Frappe method ${methodPath}:`, error)
      throw error
    }
  }

  async getMetaField(doctype: string) {
    const response = await this.axiosInstance.get(
      `/api/method/${this.getFieldMetaUrl}?doctype=${doctype}`,
    )
    return response.data.message
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: this.accessToken ? `Bearer ${this.accessToken}` : '',
    }
  }
}
