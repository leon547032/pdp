List<SomeDTO> dtoList = someEntityList.stream()
    .map(entity -> {
        SomeDTO dto = BeanCopyUtils.copy(entity, SomeDTO.class);

        // SubEntity → SubDTO 변환
        List<SubDTO> subDtoList = Optional.ofNullable(entity.getSubEntities())
            .orElse(Collections.emptyList())
            .stream()
            .map(sub -> BeanCopyUtils.copy(sub, SubDTO.class))
            .collect(Collectors.toList());

        dto.setSubList(subDtoList);
        return dto;
    })
    .collect(Collectors.toList());
