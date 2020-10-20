import GL from 'src/common/GL'
import Honeybadger from './honeybadger'
import { dynamicPaths, paths } from 'src/routes'
import { myI18n } from 'src/i18n'

GL.dynamicPaths = dynamicPaths
GL.paths = paths
GL.Honeybadger = Honeybadger

GL.i18n = myI18n

;(window as any).GL = GL
