import { NextRequest, NextResponse } from 'next/server'
import { PineconeClient } from '@pinecone-database/pinecone'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory'
import {
  createPineconeIndex,
  updatePinecone
} from '../../../utils'

export async function POST() {
  const loader = new DirectoryLoader('./documents', {
    ".txt": (path) => new TextLoader(path),
    ".md": (path) => new TextLoader(path)
  })

  const docs = await loader.load()
  const indexName = 'my-test-index-2'
  const vectorDimensions = 1536

  const client = new PineconeClient()
  await client.init({
    apiKey: process.env.PINECONE_API_KEY || '',
    environment: process.env.PINECONE_ENVIRONMENT || ''
  })

  try {
    await createPineconeIndex(client, indexName, vectorDimensions)
    await updatePinecone(client, indexName, docs)
  } catch (err) {
    console.log('error: ', err)
  }

  return NextResponse.json({
    data: 'successfully created index and loaded data into pinecone...'
  })
}