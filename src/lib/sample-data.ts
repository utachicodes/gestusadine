/**
 * Sample Data Initialization
 * 
 * This file provides sample documents and queries to test the LLM Council system.
 * Run these through the API to populate the knowledge base and see the system in action.
 */

export const SAMPLE_DOCUMENTS = [
    {
        docId: 'doc-001',
        title: 'Introduction to Distributed Systems',
        source: 'Computer Science Textbook',
        category: 'technology',
        content: `Distributed systems are computing systems whose components are located on different networked computers, which communicate and coordinate their actions by passing messages to one another.

Key Characteristics:
1. Concurrency of components
2. Lack of global clock
3. Independent failures

Advantages:
- Scalability: Systems can grow by adding more nodes
- Reliability: Redundancy provides fault tolerance
- Performance: Parallel processing improves throughput
- Accessibility: Distributed systems can serve users globally

Challenges:
- Complexity in design and debugging
- Network latency and unreliability
- Data consistency issues
- Security concerns across boundaries

Common Patterns:
1. Client-Server Architecture
2. Peer-to-Peer Systems
3. Microservices Architecture
4. Publish-Subscribe Systems
5. MapReduce and Big Data Processing

Modern Applications:
- Cloud Computing (AWS, Azure, Google Cloud)
- Blockchain and Cryptocurrency
- Distributed Databases (MongoDB, Cassandra)
- Message Queues (Kafka, RabbitMQ)
- Container Orchestration (Kubernetes)`
    },
    {
        docId: 'doc-002',
        title: 'Ethical AI and Machine Learning',
        source: 'AI Ethics Institute',
        category: 'ethics',
        content: `Ethical considerations are increasingly important in AI and machine learning development.

Core Principles:
1. Fairness - Avoid bias and discrimination
2. Transparency - Explainable AI systems
3. Accountability - Clear responsibility chains
4. Privacy - Data protection and user privacy
5. Autonomy - Respect human agency

Bias in AI:
- Training data bias perpetuates historical inequalities
- Algorithmic bias from model design choices
- User bias from interaction patterns
- Measurement bias from proxy variables

Mitigation Strategies:
1. Diverse training datasets
2. Regular audits for bias
3. Explainable AI techniques
4. Ethical review boards
5. Stakeholder involvement

Impact Areas:
- Criminal Justice: Risk assessment algorithms
- Healthcare: Diagnosis and treatment recommendations
- Finance: Lending and credit decisions
- Employment: Hiring and promotion algorithms
- Education: Student assessment and resource allocation

Future Considerations:
- Regulation and compliance (AI Act, etc.)
- Global governance frameworks
- Interdisciplinary collaboration
- Continuous evaluation and improvement`
    },
    {
        docId: 'doc-003',
        title: 'Climate Change: Causes and Solutions',
        source: 'IPCC Report Summary',
        category: 'environment',
        content: `Climate change represents one of the greatest challenges facing humanity.

Scientific Consensus:
- Global temperatures rising (1.1°C since pre-industrial)
- Human activities primary cause (95%+ certainty)
- Greenhouse gas emissions driving change
- Impacts accelerating over time

Primary Causes:
1. Fossil fuel combustion (coal, oil, natural gas)
2. Industrial processes (cement, steel)
3. Agriculture (methane from livestock)
4. Land use changes (deforestation)
5. Waste decomposition

Effects:
- Rising sea levels
- Extreme weather events
- Ecosystem disruption
- Agricultural impacts
- Public health challenges
- Economic costs

Mitigation Strategies:
1. Transition to renewable energy
2. Improve energy efficiency
3. Protect and restore forests
4. Develop sustainable agriculture
5. Carbon capture technologies

Adaptation Approaches:
- Infrastructure resilience
- Water management systems
- Crop diversification
- Coastal protection
- Early warning systems

Role of Different Sectors:
- Energy: Renewable transition
- Transport: Electric vehicles
- Industry: Clean technologies
- Agriculture: Sustainable practices
- Finance: Sustainable investment`
    },
    {
        docId: 'doc-004',
        title: 'Leadership in Modern Organizations',
        source: 'Harvard Business Review',
        category: 'business',
        content: `Effective leadership has evolved significantly in modern organizations.

Traditional Leadership Models:
- Command and control approach
- Hierarchical decision-making
- Information hoarding
- Top-down communication

Modern Leadership Approaches:
1. Servant Leadership - Focus on team growth
2. Transformational Leadership - Inspire change
3. Distributed Leadership - Shared responsibility
4. Adaptive Leadership - Navigate uncertainty
5. Authentic Leadership - Lead with integrity

Key Competencies:
- Emotional Intelligence
- Strategic Thinking
- Communication Skills
- Decision-Making
- Change Management
- Delegation
- Team Building
- Crisis Management

Digital Age Challenges:
- Remote team management
- Cross-cultural collaboration
- Rapid change and uncertainty
- Work-life balance
- Technology adoption
- Data-driven decisions

Emerging Trends:
1. Purpose-driven organizations
2. Inclusive and diverse leadership
3. Agile leadership practices
4. Stakeholder capitalism
5. Environmental consciousness

Building High-Performance Teams:
- Clear vision and goals
- Psychological safety
- Continuous learning
- Recognition and rewards
- Inclusive culture
- Open communication channels`
    },
    {
        docId: 'doc-005',
        title: 'The Future of Work',
        source: 'McKinsey Global Institute',
        category: 'future',
        content: `The future of work is being shaped by technological, demographic, and social forces.

Current Trends:
- Remote and hybrid work models
- Gig economy expansion
- Automation of routine tasks
- Rise of freelancing platforms
- Emphasis on skills over credentials

Technological Changes:
1. AI and Machine Learning
2. Automation and Robotics
3. Cloud Computing
4. Digital Collaboration Tools
5. Cybersecurity Requirements

Skills for the Future:
- Critical Thinking
- Creativity and Innovation
- Emotional Intelligence
- Technical Literacy
- Adaptability
- Complex Problem-Solving
- Data Analysis
- Continuous Learning

Workplace Changes:
- Flexible working arrangements
- Co-working spaces
- Digital-first collaboration
- Performance-based evaluation
- Continuous upskilling
- Career path diversification

Opportunities:
- New job categories emerging
- Greater work-life flexibility
- Geographic independence
- Entrepreneurship enablement
- Diverse talent access

Challenges:
- Job displacement from automation
- Skills gap in workforce
- Mental health concerns
- Income inequality
- Social isolation
- Digital divide

Preparation Strategies:
- Invest in lifelong learning
- Develop soft skills
- Build multiple income streams
- Stay technologically current
- Build strong networks`
    }
];

export const SAMPLE_QUERIES = [
    'What are the biggest challenges in building distributed systems and how can they be addressed?',
    'How should organizations balance innovation with ethical considerations in AI development?',
    'What role can different sectors play in addressing climate change?',
    'What qualities define effective leadership in modern organizations?',
    'How should workers prepare for the future of work?',
    'Compare centralized versus distributed decision-making approaches',
    'What are the connections between ethical AI and organizational leadership?',
    'How can climate change impact influence business strategy?'
];

/**
 * Initialize sample data in the system
 * This function would be called during setup to populate the knowledge base
 */
export async function initializeSampleData(apiUrl: string = '/api/council'): Promise<void> {
    console.log('🚀 Initializing sample data...');

    // Upload all sample documents
    for (const doc of SAMPLE_DOCUMENTS) {
        try {
            console.log(`📄 Uploading "${doc.title}"...`);
            const response = await fetch(`${apiUrl}/documents`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(doc)
            });

            if (!response.ok) {
                console.error(`❌ Failed to upload ${doc.docId}`);
                continue;
            }

            console.log(`✅ Uploaded: ${doc.title}`);
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error: any) {
            console.error(`❌ Error uploading document: ${error.message}`);
        }
    }

    console.log('✅ Sample data initialization complete!');
    console.log('\n📋 Try these sample queries:');
    SAMPLE_QUERIES.forEach((query, idx) => {
        console.log(`  ${idx + 1}. ${query}`);
    });
}

/**
 * Clear sample data
 */
export async function clearSampleData(apiUrl: string = '/api/council'): Promise<void> {
    console.log('🗑️  Clearing sample data...');

    for (const doc of SAMPLE_DOCUMENTS) {
        try {
            const response = await fetch(`${apiUrl}/documents/${doc.docId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                console.error(`❌ Failed to delete ${doc.docId}`);
                continue;
            }

            console.log(`🗑️  Deleted: ${doc.title}`);
            await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error: any) {
            console.error(`❌ Error deleting document: ${error.message}`);
        }
    }

    console.log('✅ Sample data cleared!');
}

// Export for use in frontend
export const COUNCIL_INFO = {
    name: 'G�stuSaDine - Circle of Knowledge',
    version: '2.0.0',
    members: [
        {
            id: 'member-logic',
            name: 'The Analyst',
            role: 'Logic & Data Expert',
            description: 'Analyzes questions using structured logic and evidence',
            icon: '🧠'
        },
        {
            id: 'member-creativity',
            name: 'The Visionary',
            role: 'Creative & Innovation Expert',
            description: 'Explores novel solutions and future possibilities',
            icon: '✨'
        },
        {
            id: 'member-ethics',
            name: 'The Guardian',
            role: 'Ethics & Wellbeing Expert',
            description: 'Evaluates ethical implications and human impact',
            icon: '🛡️'
        },
        {
            id: 'member-critic',
            name: 'The Verifier',
            role: 'Critical Analysis Expert',
            description: 'Scrutinizes claims and identifies weaknesses',
            icon: '🔍'
        }
    ]
};
