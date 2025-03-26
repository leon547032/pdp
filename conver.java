List<SomeDTO> dtoList = someEntityList.stream()
    .map(entity -> {
        SomeDTO dto = BeanCopyUtils.copy(entity, SomeDTO.class);

        // SubEntity -> SubDTO
        List<SubDTO> subDTOs = Optional.ofNullable(entity.getSubEntities())
            .orElse(Collections.emptyList())
            .stream()
            .map(subEntity -> {
                SubDTO subDTO = BeanCopyUtils.copy(subEntity, SubDTO.class);

                // IdEntity -> IdDTO
                if (subEntity.getIdEntity() != null) {
                    IdDTO idDTO = BeanCopyUtils.copy(subEntity.getIdEntity(), IdDTO.class);
                    subDTO.setIdDTO(idDTO);
                }

                return subDTO;
            })
            .collect(Collectors.toList());

        dto.setSubList(subDTOs);
        return dto;
    })
    .collect(Collectors.toList());
