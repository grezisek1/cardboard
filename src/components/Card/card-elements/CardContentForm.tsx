import { useState, useRef } from 'react'
import { useInput } from '../../../hooks/useInput'

import { CardModelData } from '../../../data'
import styles from './CardContentForm.module.css'

interface CardContentFormProps {
  initialValues: CardModelData
  onSubmit(values: CardModelData): void
  onDeleteCard?(cardId: number): void
}

export const CardContentForm = (props: CardContentFormProps) => {
  const { value, handleChange } = useInput(props.initialValues.content)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [ fontShrinkagePx, setFrontShrinkagePx ] = useState(0)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    props.onSubmit({ ...props.initialValues, content: value })
  }

  const handleDeleteOnBackspace = (event: React.KeyboardEvent) => {
    if (event.key === 'Backspace' && value === '') {
      props.onDeleteCard && props.onDeleteCard(props.initialValues.id)
    }
  }

  const handleChangeDecorated = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleChange(e);
    autoshrinkFontSize();
  }

  const autoshrinkFontSize = () => {
    const fontShrinkagePxMax = 100;
    let fontShrinkagePxCurrent = fontShrinkagePx;
    shrinkUntilNoOverflow: while (textareaRef.current) {
      if (fontShrinkagePxCurrent >= fontShrinkagePxMax) {
        break shrinkUntilNoOverflow;
      }
      if (textareaRef.current.clientWidth == textareaRef.current.offsetWidth) {
        break shrinkUntilNoOverflow;
      }

      fontShrinkagePxCurrent += 2;
      textareaRef.current.style.setProperty("--font-shrinkage-px", `${fontShrinkagePxCurrent}px`);
    }
    if (fontShrinkagePxCurrent != fontShrinkagePx) {
      setFrontShrinkagePx(fontShrinkagePxCurrent);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <textarea
        className={styles.textarea}
        autoFocus
        placeholder={'Start typing or press Backspace to delete this card'}
        value={value}
        onKeyDown={handleDeleteOnBackspace}
        onBlur={handleSubmit}
        onChange={handleChangeDecorated}
        ref={textareaRef}
      />
    </form>
  )
}
