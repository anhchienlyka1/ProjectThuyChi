-- ============================================
-- Kiểm Tra Dữ Liệu Vietnamese Modules
-- ============================================

-- 1. Xem tất cả bài Tập Đánh Vần
SELECT 
    id,
    JSON_UNQUOTE(JSON_EXTRACT(content, '$.word')) as word,
    JSON_UNQUOTE(JSON_EXTRACT(content, '$.image')) as image,
    JSON_UNQUOTE(JSON_EXTRACT(content, '$.hint')) as hint,
    order_index
FROM questions 
WHERE level_id = 'spelling' 
  AND is_deleted = false
ORDER BY order_index;

-- 2. Xem tất cả bài Ghép Từ Đơn
SELECT 
    id,
    JSON_UNQUOTE(JSON_EXTRACT(content, '$.word')) as word,
    JSON_UNQUOTE(JSON_EXTRACT(content, '$.image')) as image,
    JSON_UNQUOTE(JSON_EXTRACT(content, '$.hint')) as hint,
    order_index
FROM questions 
WHERE level_id = 'simple-words' 
  AND is_deleted = false
ORDER BY order_index;

-- 3. Đếm số lượng bài học theo level
SELECT 
    level_id,
    COUNT(*) as total_questions,
    MIN(order_index) as first_order,
    MAX(order_index) as last_order
FROM questions 
WHERE is_deleted = false 
  AND level_id IN ('spelling', 'simple-words')
GROUP BY level_id;

-- 4. Xem chi tiết 1 bài Tập Đánh Vần (bao gồm parts và options)
SELECT 
    id,
    level_id,
    question_type,
    content,
    order_index,
    points
FROM questions 
WHERE level_id = 'spelling' 
  AND is_deleted = false
LIMIT 1;

-- 5. Kiểm tra các level Vietnamese có trong hệ thống
SELECT 
    l.id,
    l.title,
    l.subtitle,
    l.icon,
    l.level_number,
    COUNT(q.id) as total_questions
FROM levels l
LEFT JOIN questions q ON l.id = q.level_id AND q.is_deleted = false
WHERE l.subject_id = 'vietnamese'
GROUP BY l.id, l.title, l.subtitle, l.icon, l.level_number
ORDER BY l.level_number;

-- 6. Xem toàn bộ content JSON của 1 bài Spelling
SELECT 
    JSON_PRETTY(content) as formatted_content
FROM questions 
WHERE level_id = 'spelling' 
  AND is_deleted = false
LIMIT 1;

-- ============================================
-- Queries Hữu Ích Cho Quản Lý
-- ============================================

-- Tìm bài học theo từ khóa
SELECT 
    id,
    level_id,
    JSON_UNQUOTE(JSON_EXTRACT(content, '$.word')) as word,
    JSON_UNQUOTE(JSON_EXTRACT(content, '$.hint')) as hint
FROM questions 
WHERE level_id IN ('spelling', 'simple-words')
  AND is_deleted = false
  AND (
    JSON_EXTRACT(content, '$.word') LIKE '%CÁ%'
    OR JSON_EXTRACT(content, '$.hint') LIKE '%nước%'
  );

-- Xem các bài đã bị xóa (soft delete)
SELECT 
    id,
    level_id,
    JSON_UNQUOTE(JSON_EXTRACT(content, '$.word')) as word,
    is_deleted
FROM questions 
WHERE level_id IN ('spelling', 'simple-words')
  AND is_deleted = true;

-- Thống kê tổng quan
SELECT 
    'Tập Đánh Vần' as module,
    COUNT(*) as total,
    AVG(points) as avg_points
FROM questions 
WHERE level_id = 'spelling' AND is_deleted = false

UNION ALL

SELECT 
    'Ghép Từ Đơn' as module,
    COUNT(*) as total,
    AVG(points) as avg_points
FROM questions 
WHERE level_id = 'simple-words' AND is_deleted = false;
