import { apiEndpoint } from '../config'
import { Todo } from '../types/Todo'
import { CreateTodoRequest } from '../types/CreateTodoRequest'
import Axios from 'axios'
import { UpdateTodoRequest } from '../types/UpdateTodoRequest'
import { Recipe } from '../types/Recipe'

import Cookies from 'js-cookie'

export async function getRecipes(): Promise<Recipe[]> {
  console.log('Fetching recipes')

  const response = await Axios.get(`${apiEndpoint}/recipes`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getIdToken()}`
    }
  })

  return response.data.items
}

export async function getRecipe(recipeId: string): Promise<Recipe> {
  console.log('Fetching recipes')

  const response = await Axios.get(`${apiEndpoint}/recipes/${recipeId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getIdToken()}`
    }
  })

  return response.data.items
}

export async function createRecipe(recipe: Recipe): Promise<Todo> {
  const response = await Axios.post(
    `${apiEndpoint}/recipes`,
    JSON.stringify(recipe),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getIdToken()}`
      }
    }
  )
  return response.data.item
}

export async function updateRecipe(updatedRecipe: Recipe): Promise<void> {
  await Axios.patch(
    `${apiEndpoint}/recipes/${updatedRecipe.partitionKey}`,
    JSON.stringify(updatedRecipe),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getIdToken()}`
      }
    }
  )
}

export async function deleteRecipe(recipeId: string): Promise<void> {
  await Axios.delete(`${apiEndpoint}/recipes/${recipeId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getIdToken()}`
    }
  })
}

function getIdToken(): string {
  const token = Cookies.get('idToken')
  if (!token || token.length === 0) {
    return ''
  }
  return token
}

export async function searchRecipes(searchTerm: string): Promise<Recipe[]> {
  const response = await Axios.get(
    `${apiEndpoint}/recipes/search?searchTerm=${searchTerm}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getIdToken()}`
      }
    }
  )

  return response.data.recipes
}

export async function getUploadUrl(type: string): Promise<ImageUploadResult> {
  const response = await Axios.post(
    `${apiEndpoint}/recipes/attachment?fileType=${type}`,
    '',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getIdToken()}`
      }
    }
  )
  return { uploadUrl: response.data.uploadUrl, imgUrl: response.data.imgUrl }
}

export async function uploadFile(
  uploadUrl: string,
  file: Buffer
): Promise<any> {
  return Axios.put(uploadUrl, file)
}

export interface ImageUploadResult {
  uploadUrl: string
  imgUrl: string
}
