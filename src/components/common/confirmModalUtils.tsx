import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

interface ConfirmModalProps {
  title: string
  content: string
  onConfirm: () => void | Promise<void>
  okText?: string
  cancelText?: string
  danger?: boolean
}

/**
 * 显示确认弹窗
 */
export const showConfirmModal = ({
  title,
  content,
  onConfirm,
  okText = '确定',
  cancelText = '取消',
  danger = false,
}: ConfirmModalProps) => {
  Modal.confirm({
    title,
    icon: <ExclamationCircleOutlined />,
    content,
    okText,
    cancelText,
    okButtonProps: { danger },
    onOk: onConfirm,
  })
}

/**
 * 显示删除确认弹窗
 */
export const showDeleteConfirm = (itemName: string, onConfirm: () => void | Promise<void>) => {
  showConfirmModal({
    title: '确认删除',
    content: `确定要删除 "${itemName}" 吗？此操作不可恢复。`,
    onConfirm,
    okText: '删除',
    danger: true,
  })
}
