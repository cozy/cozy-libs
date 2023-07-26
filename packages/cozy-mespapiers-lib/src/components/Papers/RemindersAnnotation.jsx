import useFetchJSON from 'cozy-client/dist/hooks/useFetchJSON'

export const RemindersAnnotation = ({ file }) => {
  const { data } = useFetchJSON('GET', `/notes/${file._id}/text`)

  return data
}
