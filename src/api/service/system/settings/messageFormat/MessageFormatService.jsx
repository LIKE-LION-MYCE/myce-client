import instance from "../../../../lib/axios"

const MESSAGE_TEMPLATE_PREFIX = '/settings/message-template';

const getList = (page) => {
    return instance.get(`${MESSAGE_TEMPLATE_PREFIX}?page=${page}`);
}

