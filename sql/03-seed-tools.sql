USE toolsapp;

INSERT INTO tool_catalog (tool_code, tool_name, icon, color, description, enabled, sort_order, created_at, updated_at)
VALUES
('calculator', '计算器', '🧮', '#5B8FF9', '基础四则运算', 1, 1, NOW(), NOW()),
('unit-converter', '单位转换', '📏', '#61DDAA', '长度重量温度换算', 1, 2, NOW(), NOW()),
('flashlight', '手电筒', '🔦', '#F6BD16', '快速打开手电筒', 1, 3, NOW(), NOW()),
('qrcode-generator', '二维码生成', '🔳', '#7262FD', '本地生成二维码', 1, 4, NOW(), NOW()),
('timestamp-converter', '时间戳转换', '⏱️', '#78D3F8', '时间戳与日期互转', 1, 5, NOW(), NOW()),
('text-tools', '文本工具', '📝', '#F6903D', '常用文本处理合集', 1, 6, NOW(), NOW())
ON DUPLICATE KEY UPDATE
  tool_name = VALUES(tool_name),
  icon = VALUES(icon),
  color = VALUES(color),
  description = VALUES(description),
  enabled = VALUES(enabled),
  sort_order = VALUES(sort_order),
  updated_at = NOW();
