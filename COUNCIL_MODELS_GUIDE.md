# LLM Council Model Configuration Guide

## Overview

The XamSaDine AI Circle of Knowledge uses a multi-agent epistemic architecture with 4 specialized council members, each optimized with specific models for their roles.

## Recommended Models (All FREE on OpenRouter!)

### 1. The Analyst (Logic & Data Expert)
- **Model**: `allenai/olmo-3.1-32b-think` ✅ FREE
- **Provider**: AllenAI
- **Temperature**: 0.2
- **Max Tokens**: 2000
- **Context Window**: 66K
- **Why**: Deep reasoning and complex multi-step logic. Perfect for structured analysis and logical breakdown. Designed specifically for reasoning tasks.

### 2. The Visionary (Creative & Innovation Expert)
- **Model**: `tngtech/r1t-chimera` ✅ FREE
- **Provider**: TNG
- **Temperature**: 0.8
- **Max Tokens**: 2000
- **Context Window**: 164K
- **Why**: Creative storytelling and character interaction. Excellent for lateral thinking and novel solutions. High EQ-Bench3 score (~1305).

### 3. The Guardian (Ethics & Wellbeing Expert)
- **Model**: `xiaomi/mimo-v2-flash` ✅ FREE
- **Provider**: Xiaomi
- **Temperature**: 0.6
- **Max Tokens**: 2000
- **Context Window**: 262K
- **Why**: Excellent reasoning capabilities. Top performer in multiple categories. Best for evaluating ethical implications and impact. Supports hybrid-thinking toggle.

### 4. The Verifier (Critical Analysis Expert)
- **Model**: `nvidia/nemotron-3-nano-30b-a3b` ✅ FREE
- **Provider**: NVIDIA
- **Temperature**: 0.5
- **Max Tokens**: 2000
- **Context Window**: 256K
- **Why**: High compute efficiency for critical analysis. Best for scrutinizing claims and identifying weaknesses. Optimized for agentic AI systems.

### Synthesis Engine
- **Model**: `xiaomi/mimo-v2-flash` ✅ FREE
- **Provider**: Xiaomi
- **Temperature**: 0.5
- **Max Tokens**: 3000
- **Context Window**: 262K
- **Why**: Massive context window and excellent reasoning for synthesizing council responses. Top #1 in Trivia, Academia, Finance, and Science categories. Performance comparable to Claude Sonnet 4.5.

## How to Verify OpenRouter Configuration

### Step 1: Check Environment Variable
Ensure your `.env` file contains:
```env
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### Step 2: Access Admin Config Page
1. Navigate to `/admin/config` (requires admin access)
2. You'll see the OpenRouter API Status section at the top
3. If configured correctly, you'll see: ✅ API Key configured

### Step 3: Test Individual Models
1. For each council member, click the **"Test"** button
2. The system will send a test query to verify the model is responding
3. You'll see:
   - ✅ Green checkmark = Model is working correctly
   - ❌ Red X = Model test failed (check error message)

### Step 4: Test All Models
Click the **"Test All Models"** button to verify all 4 council members at once.

### Step 5: Verify Recommended Models
- Each agent card shows if it's using the recommended model with a **"Recommended"** badge
- If not using the recommended model, you'll see a yellow warning with a button to **"Use Recommended Model"**

## Model Configuration

### Current Configuration Location
- **Frontend**: `src/pages/AdminConfig.tsx` - UI for configuring models
- **Backend**: `backend/services/llm-service/llm-council.ts` - Actual council implementation
- **Model Definitions**: `src/lib/council-models.ts` - Recommended model configurations

### Changing Models
1. Go to `/admin/config`
2. Select a different model from the dropdown for any agent
3. Adjust temperature and max tokens if needed
4. Click **"Save"** to persist changes
5. Click **"Test"** to verify the new model works

## Troubleshooting

### "API Key not configured" Error
- Check your `.env` file has `VITE_OPENROUTER_API_KEY`
- Restart your dev server after adding the key
- Ensure the key is valid (get it from https://openrouter.ai)

### "Test Failed" Error
- Verify your OpenRouter API key has credits/balance
- Check the model ID is correct (e.g., `openai/gpt-4o`)
- Ensure you have access to the selected model on OpenRouter
- Check browser console for detailed error messages

### Model Not Responding
- Some models may be temporarily unavailable on OpenRouter
- Try testing with a different model from the same provider
- Check OpenRouter status page: https://openrouter.ai/docs

## Cost Considerations

**All recommended models are FREE!** 🎉

- **Olmo 3.1 32B Think**: $0/M input tokens, $0/M output tokens
- **TNG R1T Chimera**: $0/M input tokens, $0/M output tokens
- **MiMo-V2-Flash**: $0/M input tokens, $0/M output tokens
- **Nemotron 3 Nano 30B**: $0/M input tokens, $0/M output tokens

**Note**: Some free models may log prompts/output for improvement purposes. Check provider documentation for details. For production systems with sensitive data, consider using paid models or self-hosting.

### Alternative Paid Models (if needed)
If you need paid models for production or specific requirements:
- **GPT-4o**: $0.005/$0.015 per 1K tokens
- **Claude 3 Opus**: $0.015/$0.075 per 1K tokens
- **Mistral Large**: $0.002/$0.006 per 1K tokens

## Best Practices

1. **Always test after changing models** - Use the Test button to verify
2. **Use recommended models** - They're optimized for each agent's role
3. **Monitor costs** - Check your OpenRouter dashboard regularly
4. **Keep API key secure** - Never commit `.env` files to git
5. **Start with defaults** - The recommended configuration is tested and optimized

## Architecture

The Circle of Knowledge architecture:
```
User Query
    ↓
Fiqh Reasoning Agent (Central Hub)
    ↓
    ├─→ The Analyst (GPT-4o) - Logic & Data
    ├─→ The Visionary (Claude Opus) - Creativity
    ├─→ The Guardian (Mistral Large) - Ethics
    └─→ The Verifier (Llama 3 70B) - Critical Analysis
    ↓
Epistemic Synthesis Engine (Claude Opus)
    ↓
Final Epistemic State
```

Each agent operates independently (epistemic independence) and provides their perspective, which is then synthesized into a final answer.

