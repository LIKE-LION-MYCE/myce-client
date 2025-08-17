import instance from "../../../../lib/axios"

const MESSAGE_TEMPLATE_PREFIX = '/settings/message-template';

const getMessageTemplateList = async (page) => {
    return await instance.get(`${MESSAGE_TEMPLATE_PREFIX}?page=${page}`);
}

const getMessageTemplate = async (id) => {
    return await instance.get(`${MESSAGE_TEMPLATE_PREFIX}/${id}`);
}

const updateMessageTemplate = async (id, name, subject, content) => {
    return await instance.put(`${MESSAGE_TEMPLATE_PREFIX}/${id}`, 
        {name, subject, content}
    );
}

export {
    getMessageTemplateList,
    getMessageTemplate,
    updateMessageTemplate
}