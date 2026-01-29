import { Exercise } from '../models/exercise.model';

export const MOCK_VIETNAMESE_EXERCISES: Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
        title: 'Làm quen với các con vật',
        description: 'Bé hãy ghép vần tên các con vật quen thuộc nhé!',
        type: 'simple-words',
        category: 'vietnamese',
        status: 'published',
        difficulty: 'easy',
        questionCount: 10,
        tags: ['động vật', 'cơ bản'],
        questions: [
            {
                type: 'simple-words',
                data: {
                    word: 'CÁ',
                    meaning: 'Con cá bơi dưới nước',
                    syllables: ['C', 'Á'],
                    distractors: ['A', 'BA', 'M'],
                    iconEmoji: '🐟'
                }
            },
            {
                type: 'simple-words',
                data: {
                    word: 'GÀ',
                    meaning: 'Con gà kêu cục tác',
                    syllables: ['G', 'À'],
                    distractors: ['C', 'DA', 'L'],
                    iconEmoji: '🐔'
                }
            },
            {
                type: 'simple-words',
                data: {
                    word: 'CHO',
                    meaning: 'Cho bé quà',
                    syllables: ['CH', 'O'],
                    distractors: ['A', 'NH', 'TR'],
                    iconEmoji: '🎁'
                }
            },
            {
                type: 'simple-words',
                data: {
                    word: 'MÈO',
                    meaning: 'Con mèo kêu meo meo',
                    syllables: ['M', 'ÈO'],
                    distractors: ['EO', 'AO', 'N'],
                    iconEmoji: '🐱'
                }
            },
            {
                type: 'simple-words',
                data: {
                    word: 'LỢN',
                    meaning: 'Con lợn ủn ỉn',
                    syllables: ['L', 'ỢN'],
                    distractors: ['ON', 'EN', 'TR'],
                    iconEmoji: '🐷'
                }
            },
            {
                type: 'simple-words',
                data: {
                    word: 'VỊT',
                    meaning: 'Con vịt kêu cạp cạp',
                    syllables: ['V', 'ỊT'],
                    distractors: ['IT', 'OT', 'D'],
                    iconEmoji: '🦆'
                }
            },
            {
                type: 'simple-words',
                data: {
                    word: 'BÒ',
                    meaning: 'Con bò ăn cỏ',
                    syllables: ['B', 'Ò'],
                    distractors: ['O', 'C', 'L'],
                    iconEmoji: '🐄'
                }
            },
            {
                type: 'simple-words',
                data: {
                    word: 'HỔ',
                    meaning: 'Con hổ trong rừng',
                    syllables: ['H', 'Ổ'],
                    distractors: ['O', 'A', 'NG'],
                    iconEmoji: '🐯'
                }
            },
            {
                type: 'simple-words',
                data: {
                    word: 'SÓC',
                    meaning: 'Con sóc trên cây',
                    syllables: ['S', 'ÓC'],
                    distractors: ['OC', 'AC', 'KH'],
                    iconEmoji: '🐿️'
                }
            },
            {
                type: 'simple-words',
                data: {
                    word: 'KHỈ',
                    meaning: 'Con khỉ leo trèo',
                    syllables: ['KH', 'Ỉ'],
                    distractors: ['I', 'E', 'L'],
                    iconEmoji: '🐵'
                }
            }
        ]
    },
    {
        title: 'Tập đánh vần cơ bản',
        description: 'Bé tập đánh vần các từ đơn giản',
        type: 'spelling',
        category: 'vietnamese',
        status: 'published',
        difficulty: 'easy',
        questionCount: 10,
        tags: ['đánh vần', 'gia đình'],
        questions: [
            {
                type: 'spelling',
                data: {
                    word: 'BÀ',
                    correctSpelling: 'B-À',
                    hint: 'Người sinh ra mẹ',
                    parts: [{ text: 'B', missing: false }, { text: 'À', missing: true }],
                    options: ['À', 'Á', 'Ạ', 'Ả'],
                    iconEmoji: '👵'
                }
            },
            {
                type: 'spelling',
                data: {
                    word: 'BỐ',
                    correctSpelling: 'B-Ố',
                    hint: 'Người sinh ra con (cha)',
                    parts: [{ text: 'B', missing: false }, { text: 'Ố', missing: true }],
                    options: ['Ố', 'Ô', 'Ọ', 'Ỏ'],
                    iconEmoji: '👨'
                }
            },
            {
                type: 'spelling',
                data: {
                    word: 'MẸ',
                    correctSpelling: 'M-Ẹ',
                    hint: 'Người sinh ra con',
                    parts: [{ text: 'M', missing: false }, { text: 'Ẹ', missing: true }],
                    options: ['Ẹ', 'E', 'É', 'Ẻ'],
                    iconEmoji: '👩'
                }
            },
            {
                type: 'spelling',
                data: {
                    word: 'CÔ',
                    correctSpelling: 'C-Ô',
                    hint: 'Em gái của bố',
                    parts: [{ text: 'C', missing: false }, { text: 'Ô', missing: true }],
                    options: ['Ô', 'Ơ', 'O', 'A']
                }
            },
            {
                type: 'spelling',
                data: {
                    word: 'CHÚ',
                    correctSpelling: 'CH-Ú',
                    hint: 'Em trai của bố',
                    parts: [{ text: 'CH', missing: false }, { text: 'Ú', missing: true }],
                    options: ['Ú', 'U', 'Ụ', 'Ủ']
                }
            },
            {
                type: 'spelling',
                data: {
                    word: 'DÌ',
                    correctSpelling: 'D-Ì',
                    hint: 'Em gái của mẹ',
                    parts: [{ text: 'D', missing: false }, { text: 'Ì', missing: true }],
                    options: ['Ì', 'I', 'Í', 'Ị']
                }
            },
            {
                type: 'spelling',
                data: {
                    word: 'ANH',
                    correctSpelling: 'A-NH',
                    hint: 'Con trai lớn trong nhà',
                    parts: [{ text: 'A', missing: false }, { text: 'NH', missing: true }],
                    options: ['NH', 'NG', 'CH', 'TR']
                }
            },
            {
                type: 'spelling',
                data: {
                    word: 'EM',
                    correctSpelling: 'E-M',
                    hint: 'Người nhỏ hơn mình',
                    parts: [{ text: 'E', missing: false }, { text: 'M', missing: true }],
                    options: ['M', 'N', 'P', 'T']
                }
            },
            {
                type: 'spelling',
                data: {
                    word: 'ÔNG',
                    correctSpelling: 'Ô-NG',
                    hint: 'Người sinh ra bố/mẹ',
                    parts: [{ text: 'Ô', missing: false }, { text: 'NG', missing: true }],
                    options: ['NG', 'NH', 'CH', 'C']
                }
            },
            {
                type: 'spelling',
                data: {
                    word: 'BÁC',
                    correctSpelling: 'B-Á-C',
                    hint: 'Anh/chị của bố/mẹ',
                    parts: [{ text: 'B', missing: false }, { text: 'Á', missing: true }, { text: 'C', missing: false }],
                    options: ['Á', 'A', 'Ă', 'Â']
                }
            }
        ]
    },
    {
        title: 'Điền từ còn thiếu',
        description: 'Bé hãy điền chữ cái còn thiếu vào chỗ trống nhé',
        type: 'fill-in-blank',
        category: 'vietnamese',
        status: 'published',
        difficulty: 'easy',
        questionCount: 10,
        tags: ['điền từ', 'đồ vật'],
        questions: [
            {
                type: 'fill-in-blank',
                data: {
                    phrase: 'Cái _àn',
                    correctAnswer: 'b',
                    options: ['b', 'c', 'd', 'đ'],
                    fullText: 'Cái bàn',
                    iconEmoji: '🪑'
                }
            },
            {
                type: 'fill-in-blank',
                data: {
                    phrase: 'Cái _hế',
                    correctAnswer: 'g',
                    options: ['g', 'k', 'qu', 'ng'],
                    fullText: 'Cái ghế'
                }
            },
            {
                type: 'fill-in-blank',
                data: {
                    phrase: 'Quyển _ở',
                    correctAnswer: 'v',
                    options: ['v', 'd', 'gi', 'r'],
                    fullText: 'Quyển vở',
                    iconEmoji: '📓'
                }
            },
            {
                type: 'fill-in-blank',
                data: {
                    phrase: 'Cây _út',
                    correctAnswer: 'b',
                    options: ['b', 'p', 'nh', 'ch'],
                    fullText: 'Cây bút',
                    iconEmoji: '✏️'
                }
            },
            {
                type: 'fill-in-blank',
                data: {
                    phrase: 'Cái _ặp',
                    correctAnswer: 'c',
                    options: ['c', 'k', 'qu', 't'],
                    fullText: 'Cái cặp'
                }
            },
            {
                type: 'fill-in-blank',
                data: {
                    phrase: 'Đèn _ọc',
                    correctAnswer: 'h',
                    options: ['h', 'k', 'l', 'm'],
                    fullText: 'Đèn học'
                }
            },
            {
                type: 'fill-in-blank',
                data: {
                    phrase: 'Cái _Ly',
                    correctAnswer: 'L',
                    options: ['L', 'N', 'M', 'B'],
                    fullText: 'Cái Ly' // Should clarify capitalization
                }
            },
            {
                type: 'fill-in-blank',
                data: {
                    phrase: 'Thước _ẻ',
                    correctAnswer: 'k',
                    options: ['k', 'c', 'qu', 'kh'],
                    fullText: 'Thước kẻ'
                }
            },
            {
                type: 'fill-in-blank',
                data: {
                    phrase: 'Cục _ẩy',
                    correctAnswer: 't',
                    options: ['t', 'th', 'tr', 'ch'],
                    fullText: 'Cục tẩy'
                }
            },
            {
                type: 'fill-in-blank',
                data: {
                    phrase: 'Bảng _en',
                    correctAnswer: 'đ',
                    options: ['đ', 'd', 'n', 'l'],
                    fullText: 'Bảng đen'
                }
            }
        ]
    }
];
