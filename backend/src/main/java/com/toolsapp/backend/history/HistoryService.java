package com.toolsapp.backend.history;

import com.toolsapp.backend.common.BizException;
import com.toolsapp.backend.common.PageResult;
import com.toolsapp.backend.history.dto.HistoryCreateRequest;
import com.toolsapp.backend.history.dto.HistoryItemVO;
import com.toolsapp.backend.history.entity.UserHistory;
import com.toolsapp.backend.history.repository.UserHistoryRepository;
import com.toolsapp.backend.security.CurrentUser;
import com.toolsapp.backend.user.entity.SysUser;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class HistoryService {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final UserHistoryRepository userHistoryRepository;

    public HistoryService(UserHistoryRepository userHistoryRepository) {
        this.userHistoryRepository = userHistoryRepository;
    }

    @Transactional
    public void create(HistoryCreateRequest request) {
        SysUser user = CurrentUser.require();
        UserHistory history = new UserHistory();
        history.setUserId(user.getId());
        history.setToolCode(request.getToolCode());
        history.setToolName(request.getToolName());
        history.setSummary(trimSummary(request.getSummary()));
        history.setCreatedAt(LocalDateTime.now());
        userHistoryRepository.save(history);
    }

    public PageResult<HistoryItemVO> page(int pageNum, int pageSize) {
        SysUser user = CurrentUser.require();
        var page = userHistoryRepository.findAllByUserId(
                user.getId(),
                PageRequest.of(Math.max(pageNum - 1, 0), pageSize, Sort.by(Sort.Direction.DESC, "createdAt"))
        );
        return new PageResult<>(
                page.getContent().stream()
                        .map(item -> new HistoryItemVO(
                                item.getId(),
                                item.getToolCode(),
                                item.getToolName(),
                                item.getSummary(),
                                item.getCreatedAt().format(FORMATTER)
                        ))
                        .toList(),
                pageNum,
                pageSize,
                page.getTotalElements()
        );
    }

    @Transactional
    public void deleteOne(Long id) {
        SysUser user = CurrentUser.require();
        UserHistory history = userHistoryRepository.findById(id).orElseThrow(() -> new BizException("历史记录不存在"));
        if (!history.getUserId().equals(user.getId())) {
            throw new BizException(403, "无权限删除该历史记录");
        }
        userHistoryRepository.delete(history);
    }

    @Transactional
    public void clear() {
        SysUser user = CurrentUser.require();
        userHistoryRepository.deleteAllByUserId(user.getId());
    }

    public String trimSummary(String summary) {
        if (summary == null) {
            return "";
        }
        return summary.length() <= 255 ? summary : summary.substring(0, 255);
    }
}