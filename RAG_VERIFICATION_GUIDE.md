# RAG System Verification Guide

## ⚠️ Important: RAG Uses Embeddings (Separate from Chat Models)

The RAG system has **two components**:

1. **Embeddings** (for document indexing and search) - Uses `openai/text-embedding-3-small`
2. **Chat Models** (for council responses) - Uses the free models we configured

## Current Setup

### ✅ Chat Models (FREE)
All council members use FREE models:
- **The Analyst**: `allenai/olmo-3.1-32b-think` ✅ FREE
- **The Visionary**: `tngtech/r1t-chimera` ✅ FREE  
- **The Guardian**: `xiaomi/mimo-v2-flash` ✅ FREE
- **The Verifier**: `nvidia/nemotron-3-nano-30b-a3b` ✅ FREE
- **Synthesis**: `xiaomi/mimo-v2-flash` ✅ FREE

### ⚠️ Embeddings (Very Low Cost, Not Free)
- **Model**: `openai/text-embedding-3-small`
- **Cost**: ~$0.0001 per 1K tokens (extremely cheap)
- **Why**: Embeddings are separate from chat models and require a dedicated embedding model

## How RAG Works

1. **Document Upload**: 
   - Text is chunked into 500-character pieces
   - Each chunk is converted to an embedding vector
   - Embeddings are stored in Supabase vector database

2. **Query Processing**:
   - User query is converted to an embedding
   - Similarity search finds top 5 most relevant chunks
   - Relevant context is passed to council members

3. **Council Response**:
   - Each council member receives: `[User Query] + [RAG Context]`
   - They process using their FREE chat models
   - Responses are synthesized

## Verification Steps

### Step 1: Test Embeddings
```bash
# Check if embeddings work (will cost ~$0.0001)
# This happens automatically when you upload documents
```

### Step 2: Test RAG with Council
1. Upload a test document via `/documents`
2. Ask a question related to that document via Circle of Knowledge
3. Check if the council references the document in responses

### Step 3: Verify Free Models Work
1. Go to `/admin/config`
2. Click "Test All Models" 
3. All 4 council members should respond ✅

## Cost Breakdown

### FREE Components ✅
- All 4 council member responses: **$0**
- Synthesis engine: **$0**
- Total chat costs: **$0**

### Low-Cost Components 💰
- Embeddings for document indexing: ~$0.0001 per 1K tokens
- Example: 100 documents = ~$0.01 total

## Potential Issues & Solutions

### Issue 1: Embeddings Fail
**Symptom**: Documents upload but don't get indexed
**Solution**: 
- Check OpenRouter API key has credits
- Embeddings use `openai/text-embedding-3-small` (very cheap but not free)
- Ensure API key has at least $0.10 balance for embeddings

### Issue 2: Free Models Don't Support Context Well
**Symptom**: Council responses ignore RAG context
**Solution**:
- The free models have good context windows (66K-262K)
- If issues occur, try:
  - `xiaomi/mimo-v2-flash` (262K context) for synthesis
  - Ensure RAG context is properly formatted

### Issue 3: Models Rate Limited
**Symptom**: "Rate limit exceeded" errors
**Solution**:
- Free models may have rate limits
- Add delays between requests
- Consider upgrading OpenRouter account for higher limits

## Testing Checklist

- [ ] Upload a test document (TXT or MD file)
- [ ] Verify document appears in document list
- [ ] Ask a question related to the document
- [ ] Check if council responses reference the document
- [ ] Test all 4 council members individually
- [ ] Verify synthesis combines responses correctly
- [ ] Check browser console for any errors

## Expected Behavior

✅ **Working Correctly**:
- Documents upload and get indexed
- Queries retrieve relevant document chunks
- Council members reference document content
- Synthesis combines all perspectives
- All models respond within 5-10 seconds

❌ **Not Working**:
- Documents upload but queries return no context
- Council responses don't mention documents
- Models timeout or fail to respond
- Embedding generation errors

## Free Embedding Alternatives (If Needed)

If you want completely free embeddings, you could:
1. Use a local embedding model (requires setup)
2. Use Hugging Face Inference API (free tier available)
3. Use Supabase's built-in vector search (if available)

However, `openai/text-embedding-3-small` is so cheap (~$0.0001/1K tokens) that it's practically free for most use cases.

## Recommendation

**The current setup should work**, but here's what to verify:

1. ✅ Free chat models work (tested via Admin Config)
2. ⚠️ Embeddings work (test by uploading a document)
3. ✅ RAG context is passed correctly (check council responses)
4. ✅ Synthesis works (verify final answer quality)

**Bottom Line**: The FREE chat models will work fine with RAG. The only cost is embeddings (~$0.0001 per document), which is negligible.

