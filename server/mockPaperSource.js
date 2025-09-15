// Mock data source for demonstration when external APIs are not available
class MockPaperSource {
    constructor() {
        this.mockPapers = [
            {
                title: "Attention Is All You Need: Transformers for Natural Language Processing",
                abstract: "We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train.",
                authors: ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar", "Jakob Uszkoreit"],
                publishedDate: "2024-03-15",
                url: "https://arxiv.org/abs/1706.03762",
                source: "arXiv",
                isPreprint: true,
                arxivId: "1706.03762",
                doi: null
            },
            {
                title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
                abstract: "We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers.",
                authors: ["Jacob Devlin", "Ming-Wei Chang", "Kenton Lee", "Kristina Toutanova"],
                publishedDate: "2024-03-10",
                url: "https://arxiv.org/abs/1810.04805",
                source: "arXiv",
                isPreprint: true,
                arxivId: "1810.04805",
                doi: null
            },
            {
                title: "Generative Pre-trained Transformers for Artificial Intelligence Applications",
                abstract: "This paper presents a comprehensive survey of generative pre-trained transformers and their applications in various artificial intelligence domains. We discuss the evolution from GPT-1 to the latest models and their impact on natural language processing, computer vision, and multimodal learning.",
                authors: ["Sarah Johnson", "Michael Chen", "David Rodriguez"],
                publishedDate: "2024-03-08",
                url: "https://example.com/gpt-survey",
                source: "OpenAlex",
                isPreprint: false,
                arxivId: null,
                doi: "10.1000/example.2024.001"
            },
            {
                title: "Deep Learning for Computer Vision: A Comprehensive Review",
                abstract: "Computer vision has experienced remarkable progress with the advent of deep learning. This review covers the latest developments in convolutional neural networks, vision transformers, and their applications in image classification, object detection, and semantic segmentation.",
                authors: ["Emily Zhang", "Robert Wilson", "Lisa Anderson"],
                publishedDate: "2024-03-05",
                url: "https://example.com/cv-review",
                source: "Semantic Scholar",
                isPreprint: false,
                arxivId: null,
                doi: "10.1000/example.2024.002"
            },
            {
                title: "Reinforcement Learning in Robotics: Recent Advances and Future Directions",
                abstract: "This paper surveys recent advances in reinforcement learning for robotics applications. We discuss deep Q-networks, policy gradient methods, and their applications in robot navigation, manipulation, and human-robot interaction.",
                authors: ["James Liu", "Maria Garcia", "Peter Kim"],
                publishedDate: "2024-03-02",
                url: "https://arxiv.org/abs/2403.001",
                source: "arXiv",
                isPreprint: true,
                arxivId: "2403.001",
                doi: null
            },
            {
                title: "Federated Learning for Privacy-Preserving Machine Learning",
                abstract: "Federated learning enables machine learning on decentralized data without compromising privacy. This work presents novel approaches to address the challenges of non-IID data distribution, communication efficiency, and differential privacy in federated settings.",
                authors: ["Anna Thompson", "Kevin Park", "Rachel Davis"],
                publishedDate: "2024-02-28",
                url: "https://example.com/federated-learning",
                source: "OpenAlex",
                isPreprint: false,
                arxivId: null,
                doi: "10.1000/example.2024.003"
            }
        ];
    }

    async fetchPapers(tags, includePreprints) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Filter papers based on tags (simple keyword matching)
        const filtered = this.mockPapers.filter(paper => {
            const searchText = `${paper.title} ${paper.abstract}`.toLowerCase();
            const tagMatch = tags.some(tag => 
                searchText.includes(tag.toLowerCase()) ||
                tag.toLowerCase().split(' ').some(word => searchText.includes(word))
            );
            
            const preprintMatch = includePreprints || !paper.isPreprint;
            
            return tagMatch && preprintMatch;
        });
        
        return filtered;
    }
}

module.exports = MockPaperSource;